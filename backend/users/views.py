from rest_framework import generics, permissions

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
import random
import string
from datetime import datetime, timedelta
from django.utils import timezone
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from .serializers import UserSerializer, RegisterSerializer, VerificationCodeSerializer, SendVerificationCodeRequestSerializer, SetPasswordSerializer, AddressSerializer, PaymentMethodSerializer, UserSerializer
from .models import User, VerificationCode, Address, PaymentMethod

from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            user_data = serializer.data
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'token': str(refresh.access_token),
                'user': user_data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.permissions import IsAuthenticated, AllowAny

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendVerificationCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendVerificationCodeRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            # Generate 6-digit alphanumeric code
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            expires_at = timezone.now() + timedelta(minutes=10)

            # Save or update verification code in DB
            VerificationCode.objects.update_or_create(
                email=email,
                defaults={'code': code, 'expires_at': expires_at}
            )

            # Send email
            subject = 'Your Verification Code'
            from_email = settings.DEFAULT_FROM_EMAIL or 'no-reply@campusdelivery.com'
            recipient_list = [email]

            # Render HTML email template
            html_content = render_to_string('emails/verification_code.html', {'code': code})
            text_content = strip_tags(html_content)

            try:
                email_message = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
                email_message.attach_alternative(html_content, "text/html")
                email_message.send()
            except Exception as e:
                return Response({'detail': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'detail': 'Verification code sent.'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerificationCodeSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            code = serializer.validated_data.get('code', '')
            try:
                verification = VerificationCode.objects.get(email=email)
                if verification.is_expired():
                    return Response({'detail': 'Verification code expired.'}, status=status.HTTP_400_BAD_REQUEST)
                if verification.code == code:
                    return Response({'detail': 'Verification successful.'}, status=status.HTTP_200_OK)
                else:
                    return Response({'detail': 'Invalid verification code.'}, status=status.HTTP_400_BAD_REQUEST)
            except VerificationCode.DoesNotExist:
                return Response({'detail': 'Verification code not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework_simplejwt.tokens import RefreshToken

class SetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        password = request.data.get('password')
        user_data = request.data.get('userData', {})

        # Verify the code
        try:
            verification = VerificationCode.objects.get(email=email)
            if verification.is_expired():
                return Response({'detail': 'Verification code expired.'}, status=status.HTTP_400_BAD_REQUEST)
            if verification.code != code:
                return Response({'detail': 'Invalid verification code.'}, status=status.HTTP_400_BAD_REQUEST)
        except VerificationCode.DoesNotExist:
            return Response({'detail': 'Verification code not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Set password for the user or create user if not exists
        try:
            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()
            return Response({'detail': 'Password set successfully.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            # Create new user with user_data
            serializer = RegisterSerializer(data={
                'full_name': user_data.get('firstName', '') + ' ' + user_data.get('lastName', ''),
                'gender': user_data.get('gender', ''),
                'phone': user_data.get('phoneCountryCode', '') + user_data.get('phoneNumber', ''),
                'email': email,
                'date_of_birth': user_data.get('dob', ''),
                'country': user_data.get('country', ''),
                'city': user_data.get('city', ''),
                'zip_code': user_data.get('zipCode', ''),
                'role': 'customer',
                'password': password,
            })
            if serializer.is_valid():
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                user_data = serializer.data
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'token': str(refresh.access_token),
                    'user': user_data,
                    'detail': 'User created and password set successfully.'
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        # Use email field for authentication since User model uses email as unique identifier
        print("Aunthenticating user")
        user = authenticate(request, email=email, password=password)
        print("user authenticated is:", user)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'token': str(refresh.access_token),
                'user': user_data
            }, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

class PaymentMethodListCreateView(generics.ListCreateAPIView):
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PaymentMethodDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)

from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

class UpdatePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UpdatePasswordSerializer(data=request.data)
        if serializer.is_valid():
            current_password = serializer.validated_data['current_password']
            new_password = serializer.validated_data['new_password']
            if not user.check_password(current_password):
                return Response({'current_password': ['Current password is incorrect.']}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(new_password)
            user.save()
            # Return empty response with 204 No Content status to avoid JSON parsing error on client
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

