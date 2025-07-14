from django.contrib import admin
from .models import Cart, CartItem, Coupon


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'amount', 'discount_percent', 'active', 'created_at')
    list_filter = ('active',)
    search_fields = ('code',)
    ordering = ('-created_at',)


admin.site.register(Cart)
admin.site.register(CartItem)
