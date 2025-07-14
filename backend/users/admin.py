from django.contrib import admin
from .models import PaymentMethod, Address

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('user', 'card_holder_name', 'card_number', 'expiry_date', 'mpesa_number')
    search_fields = ('user__full_name', 'card_holder_name', 'mpesa_number')

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'street_address', 'city', 'state', 'zip_code', 'phone', 'email')
    search_fields = ('user__full_name', 'street_address', 'city', 'state', 'zip_code')
