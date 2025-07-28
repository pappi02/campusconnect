from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication
from .serializers import UserSerializer, AddressSerializer, PaymentMethodSerializer, VerificationCodeSerializer, VendorSettingsSerializer
from .models import Address, PaymentMethod


User = get_user_model()

# Combined authentication (JWT + Session)
class CombinedAuthentication(SessionAuthentication, JWTAuthentication):
    pass



class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        # Set role based on request path
        path = request.path.lower()
        user.role = "vendor" if "vendor" in path else "customer"

        # Use email as username
        user.username = user.email
        user.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({'detail': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, username=user.email, password=password)

        if not user:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)

# Logout View
#class LogoutView(APIView):
#   authentication_classes = [CombinedAuthentication]
#   permission_classes = [IsAuthenticated]

#   def post(self, request):
#       try:
#           refresh_token = request.data["refresh"]
#           token = RefreshToken(refresh_token)
#           token.blacklist()  # Only if blacklist app is enabled
#           return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
#       except Exception:
#           return Response({"detail": "Logout failed or invalid token."}, status=status.HTTP_400_BAD_REQUEST)



# Password Reset via Verification Code (mock implementation)
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
import random
import string
from .models import VerificationCode

class SendVerificationCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email required"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a 6-digit numeric verification code
        code = ''.join(random.choices(string.digits, k=6))

        # Save or update the verification code in the database
        verification, created = VerificationCode.objects.update_or_create(
            email=email,
            defaults={'code': code}
        )

        # Render the HTML email template with the code
        html_content = render_to_string('emails/verification_code.html', {'code': code})

        subject = "Your Verification Code"
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]

        try:
            msg = EmailMultiAlternatives(subject, '', from_email, recipient_list)
            msg.attach_alternative(html_content, "text/html")
            msg.send()
        except Exception as e:
            return Response({"detail": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"detail": "Verification code sent."}, status=status.HTTP_200_OK)

        
        
        

# --------- Profile ---------
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class VerifyCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerificationCodeSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            code = serializer.validated_data['code']

            try:
                verification = VerificationCode.objects.get(email=email)
                if verification.is_expired():
                    return Response({'detail': 'Verification code expired.'}, status=status.HTTP_400_BAD_REQUEST)
                if verification.code == code:
                    # Get user role if user exists
                    try:
                        user = User.objects.get(email=email)
                        role = user.role
                    except User.DoesNotExist:
                        role = None
                    return Response({'detail': 'Verification successful.', 'role': role})
                return Response({'detail': 'Invalid verification code.'}, status=status.HTTP_400_BAD_REQUEST)
            except VerificationCode.DoesNotExist:
                return Response({'detail': 'Verification code not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        password = request.data.get('password')
        user_data = request.data.get('userData', {})

        try:
            verification = VerificationCode.objects.get(email=email)
            if verification.is_expired():
                return Response({'detail': 'Verification code expired.'}, status=status.HTTP_400_BAD_REQUEST)
            if verification.code != code:
                return Response({'detail': 'Invalid verification code.'}, status=status.HTTP_400_BAD_REQUEST)
        except VerificationCode.DoesNotExist:
            return Response({'detail': 'Verification code not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()
            return Response({'detail': 'Password set successfully.'})
        except User.DoesNotExist:
            serializer = UserSerializer(data={
                'first_name': user_data.get('firstName', ''),
                'last_name': user_data.get('lastName', ''),
                'phone': user_data.get('phoneCountryCode', '') + user_data.get('phoneNumber', ''),
                'email': email,
                'role': 'customer',
                'password': password,
            })
            if serializer.is_valid():
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'token': str(refresh.access_token),
                    'user': UserSerializer(user).data,
                    'detail': 'User created and password set successfully.'
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------- Password Change ---------
class UpdatePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])


class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UpdatePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['current_password']):
                return Response({'current_password': ['Current password is incorrect.']}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------- Address ---------
class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


# --------- Payment Methods ---------
class PaymentMethodListCreateView(generics.ListCreateAPIView):
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PaymentMethodDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)





class VendorSettingsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Check if user is a vendor
        if user.role != 'vendor':
            return Response(
                {"detail": "Only vendors can access settings."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = VendorSettingsSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        user = request.user
        
        # Check if user is a vendor
        if user.role != 'vendor':
            return Response(
                {"detail": "Only vendors can access settings."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = VendorSettingsSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
