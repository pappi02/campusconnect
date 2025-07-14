from django.contrib import admin
from .models import ProductDetailImage

# Product and Category are already registered, so only register ProductDetailImage here

@admin.register(ProductDetailImage)
class ProductDetailImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image')
    search_fields = ('product__name',)
