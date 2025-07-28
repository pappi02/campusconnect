from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, VerificationCode, Address, PaymentMethod

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id',
            'first_name',
            'last_name',
            'company_name',
            'country',
            'street_address',
            'city',
            'state',
            'zip_code',
            'phone',
            'email',
            'description',
        ]

class PaymentMethodSerializer(serializers.ModelSerializer):
    billing_address = AddressSerializer(read_only=True)
    type = serializers.ReadOnlyField()

    class Meta:
        model = PaymentMethod
        fields = ['id', 'card_number', 'card_holder_name', 'expiry_date', 'mpesa_number', 'billing_address', 'type']

class SendVerificationCodeRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerificationCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=10)

    def validate_email(self, value):
        # Add any email validation logic if needed
        return value

class UserSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)
    payment_methods = PaymentMethodSerializer(many=True, read_only=True)

    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'id_number', 'role', 'is_approved', 'location', 'addresses', 'payment_methods']
        read_only_fields = ['id', 'is_approved']



class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    role = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'id_number', 'role', 'location']

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        email = validated_data.get('email')
        if not email:
            raise serializers.ValidationError("Email is required to create a user.")

        user = User(
            username=email,  # <- This is the actual fix
            email=email,
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            phone=validated_data.get('phone'),
            id_number=validated_data.get('id_number'),
            role=validated_data.get('role'),
            location=validated_data.get('location', '')
        )

        if user.role != 'vendor':
            user.is_approved = True  # Auto-approve non-vendors

        user.save()
        return user



class SetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])


class VendorSettingsSerializer(serializers.ModelSerializer):
    address = serializers.CharField(source='location', required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['email', 'phone', 'address', 'email_notifications', 'sms_notifications']
        
    def validate(self, data):
        # Ensure only vendors can use this serializer
        user = self.instance
        if user and user.role != 'vendor':
            raise serializers.ValidationError("Only vendors can access settings.")
        return data
