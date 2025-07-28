from django.contrib import admin
from .models import VendorPayout

@admin.register(VendorPayout)
class VendorPayoutAdmin(admin.ModelAdmin):
    list_display = ('vendor', 'order_item', 'amount_sent', 'commission_taken', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('vendor__email', 'order_item__order__reference')
