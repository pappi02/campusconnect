from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.core.validators import RegexValidator
from django.db.models.signals import pre_save
from django.dispatch import receiver
import re

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_approved', True)

        if extra_fields.get('role') != 'admin':
            raise ValueError('Superuser must have role of admin.')
        if not extra_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff=True.')
        if not extra_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('vendor', 'Vendor'),
        ('delivery_person', 'Delivery Person'),
        ('admin', 'Admin'),
    )

    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    phone = models.CharField(validators=[phone_regex], max_length=20, unique=True)
    id_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    is_approved = models.BooleanField(default=False)  # For vendors
    location = models.CharField(max_length=255, blank=True)
    is_online = models.BooleanField(default=False)  # For delivery persons
    date_joined = models.DateTimeField(auto_now_add=True)
    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def __str__(self):
        return f"{self.full_name} ({self.role})"

@receiver(pre_save, sender=User)
def normalize_phone_number(sender, instance, **kwargs):
    if instance.phone:
        # Remove all non-digit characters
        phone_digits = re.sub(r'\D', '', instance.phone)
        # Add the country code if it's missing
        if not phone_digits.startswith('254'):
            phone_digits = '254' + phone_digits.lstrip('0')
        instance.phone = '+' + phone_digits

class VerificationCode(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)  # Code valid for 10 minutes
        super().save(*args, **kwargs)

    def is_expired(self):
        return timezone.now() > self.expires_at

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    company_name = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=100)
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    description = models.TextField(blank=True)  # location, landmark, etc.

    def __str__(self):
        return f"{self.street_address}, {self.city}, {self.state}, {self.zip_code}"

class PaymentMethod(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_methods')
    card_number = models.CharField(max_length=20, blank=True, null=True)
    card_holder_name = models.CharField(max_length=255, blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    billing_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name='payment_methods')
    mpesa_number = models.CharField(max_length=20, blank=True, null=True)

    @property
    def type(self):
        if self.mpesa_number:
            return f"Mpesa No. {self.mpesa_number}"
        elif self.card_number:
            return f"Visa {self.card_number}"
        else:
            return "Unknown"

    def __str__(self):
        if self.mpesa_number:
            return f"Mpesa: {self.mpesa_number}"
        return f"{self.card_holder_name} - {self.card_number[-4:] if self.card_number else 'N/A'}"
