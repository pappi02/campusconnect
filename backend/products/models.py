from django.db import models
from users.models import User

class Category(models.Model):
    CATEGORY_TYPE_CHOICES = (
        ('product', 'Product'),
        ('service', 'Service'),
    )
    name = models.CharField(max_length=100, unique=True)
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPE_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.category_type})"

class Product(models.Model):
    TYPE_CHOICES = (
        ('product', 'Product'),
        ('service', 'Service'),
    )

    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(blank=True, null=True)  # For tangible products; 0 for services
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    # Removed detailimages field to support multiple images via related model
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='product')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    subcategory = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.type}) by {self.vendor.full_name}"

class ProductDetailImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='detail_images')
    image = models.ImageField(upload_to='products/detail_images')

    def __str__(self):
        return f"Detail Image for {self.product.name}"
