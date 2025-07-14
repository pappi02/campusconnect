from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.utils import timezone
from datetime import timedelta

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

class User(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('vendor', 'Vendor'),
        ('delivery_person', 'Delivery Person'),
        ('admin', 'Admin'),
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True)
    id_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    is_approved = models.BooleanField(default=False)  # For vendors
    location = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.full_name} ({self.role})"

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
