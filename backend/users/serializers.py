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

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone', 'id_number', 'role', 'is_approved', 'location', 'addresses', 'payment_methods']
        read_only_fields = ['id', 'is_approved']

class RegisterSerializer(serializers.ModelSerializer):
    # Removed password field as per request

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'id_number', 'role', 'location']

    def create(self, validated_data):
        user = User(
            username=validated_data['email'],  # Use email as username
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            phone=validated_data['phone'],
            id_number=validated_data.get('id_number'),
            role=validated_data['role'],
            location=validated_data.get('location', ''),
            
        )
        # No password set since password field removed
        if user.role != 'vendor':
            user.is_approved = True  # Auto-approve non-vendors
        user.save()
        return user

class SetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
