from django.db import models
from users.models import User

# -----------------------------
# Category Structure
# -----------------------------
class Category(models.Model):
    CATEGORY_TYPE_CHOICES = (
        ('product', 'Product'),
        ('service', 'Service'),
    )
    name = models.CharField(max_length=100, unique=True)
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPE_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.category_type})"


class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} -> {self.category.name}"


# -----------------------------
# Supporting Option Models
# -----------------------------
class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Color(models.Model):
    name = models.CharField(max_length=50)
    hex_code = models.CharField(max_length=7, blank=True, null=True)  # For color picker support

    def __str__(self):
        return self.name


class Size(models.Model):
    UNIT_CHOICES = (
        ('cm', 'Centimeters'),
        ('in', 'Inches'),
        ('eu', 'EU Size'),
        ('uk', 'UK Size'),
        ('us', 'US Size'),
        ('ml', 'Milliliters'),
        ('l', 'Liters'),
        ('kg', 'Kilograms'),
        ('g', 'Grams'),
        ('unit', 'Unit'),
    )
    name = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.value} {self.unit})"


# -----------------------------
# Main Product/Service Model
# -----------------------------
class Product(models.Model):
    TYPE_CHOICES = (
        ('product', 'Product'),
        ('service', 'Service'),
    )

    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='product')

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, help_text="Main description of the product/service.")
    additional_information = models.TextField(blank=True, help_text="Any other useful or technical details.")
    price = models.DecimalField(max_digits=12, decimal_places=2)

    quantity = models.PositiveIntegerField(blank=True, null=True)  # Not applicable to all services

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='items')
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='items')

    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True)
    model = models.CharField(max_length=100, blank=True, null=True)

    colors = models.ManyToManyField(Color, blank=True)
    sizes = models.ManyToManyField(Size, blank=True)

    image = models.ImageField(upload_to='products/', blank=True, null=True)

    # Service-specific fields
    duration_minutes = models.PositiveIntegerField(blank=True, null=True, help_text="Duration in minutes for services")
    service_location = models.CharField(max_length=255, blank=True, null=True)
    available_days = models.CharField(max_length=255, blank=True, null=True, help_text="e.g. Mon-Fri")
    service_radius_km = models.IntegerField(blank=True, null=True, help_text="Service range in KM")

    # Shared
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated keywords")

    def clean(self):
        """
        Custom validation to ensure data consistency
        """
        from django.core.exceptions import ValidationError
        
        # Ensure category type matches product type
        if self.category and self.category.category_type != self.type:
            raise ValidationError(
                f"Category '{self.category.name}' is for {self.category.category_type}s, "
                f"but this item is a {self.type}."
            )
        
        # Ensure subcategory belongs to the selected category
        if self.subcategory and self.category and self.subcategory.category != self.category:
            raise ValidationError(
                f"Subcategory '{self.subcategory.name}' does not belong to "
                f"category '{self.category.name}'."
            )
        
        # Ensure subcategory is not selected without a category
        if self.subcategory and not self.category:
            raise ValidationError("You must select a category before selecting a subcategory.")

    def save(self, *args, **kwargs):
        # Run validation before saving
        self.clean()
        super().save(*args, **kwargs)
    
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return round(sum([review.rating for review in reviews]) / reviews.count(), 1)
        return 0

    def review_count(self):
        return self.reviews.count()

    def __str__(self):
        return f"{self.name} ({self.type}) by {self.vendor}"






class ProductDetailImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='detail_images')
    image = models.ImageField(upload_to='products/detail_images')

    def __str__(self):
        return f"Detail Image for {self.product.name}"



class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    rating = models.PositiveIntegerField(default=5, help_text="Rating out of 5 stars")
    comment = models.TextField(blank=True, help_text="Write a brief comment.")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'user')  # Prevents duplicate reviews per product per user

    def __str__(self):
        return f"{self.user.username} - {self.rating}⭐ for {self.product.name}"