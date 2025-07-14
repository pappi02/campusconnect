from rest_framework import serializers
from .models import Product, Category, ProductDetailImage
from users.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'category_type']

class ProductDetailImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDetailImage
        fields = ['id', 'image']

class ProductSerializer(serializers.ModelSerializer):
    vendor = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='vendor', is_approved=True))
    category = CategorySerializer(read_only=True)
    detail_images = ProductDetailImageSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'vendor', 'name', 'description', 'price', 'quantity', 'image', 'image_url', 'type', 'category', 'subcategory', 'created_at', 'detail_images']
        read_only_fields = ['id', 'created_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None
