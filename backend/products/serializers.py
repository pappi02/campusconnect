from rest_framework import serializers
from .models import Product, Category, SubCategory, Brand, Color, Size, ProductDetailImage
from users.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'category_type']

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'category']

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name', 'hex_code']

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name', 'value', 'unit']

class ProductDetailImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDetailImage
        fields = ['id', 'image']

class ProductSerializer(serializers.ModelSerializer):
    vendor = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='vendor', is_approved=True), required=False)
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    subcategory = SubCategorySerializer(read_only=True)
    subcategory_id = serializers.IntegerField(write_only=True, required=False)
    brand = BrandSerializer(read_only=True)
    brand_id = serializers.IntegerField(write_only=True, required=False)
    colors = ColorSerializer(many=True, read_only=True)
    color_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    sizes = SizeSerializer(many=True, read_only=True)
    size_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    detail_images = ProductDetailImageSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'vendor', 'type', 'name', 'description', 'additional_information', 
            'price', 'quantity', 'category', 'category_id', 'subcategory', 'subcategory_id',
            'brand', 'brand_id', 'model', 'colors', 'color_ids', 'sizes', 'size_ids',
            'image', 'image_url', 'duration_minutes', 'service_location', 'available_days',
            'service_radius_km', 'tags', 'is_active', 'created_at', 'updated_at',
            'detail_images', 'average_rating', 'review_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'average_rating', 'review_count']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

    def validate(self, data):
        # Validate that service-specific fields are only provided for services
        if data.get('type') == 'service':
            if not data.get('duration_minutes'):
                raise serializers.ValidationError("Duration is required for services.")
        else:
            # For products, quantity should be provided
            if data.get('quantity') is None:
                raise serializers.ValidationError("Quantity is required for products.")
        
        return data

    def create(self, validated_data):
        # Extract many-to-many field data
        color_ids = validated_data.pop('color_ids', [])
        size_ids = validated_data.pop('size_ids', [])
        
        # Extract foreign key IDs
        category_id = validated_data.pop('category_id', None)
        subcategory_id = validated_data.pop('subcategory_id', None)
        brand_id = validated_data.pop('brand_id', None)
        
        # Set foreign key objects
        if category_id:
            validated_data['category_id'] = category_id
        if subcategory_id:
            validated_data['subcategory_id'] = subcategory_id
        if brand_id:
            validated_data['brand_id'] = brand_id
        
        # Create the product
        product = Product.objects.create(**validated_data)
        
        # Set many-to-many relationships
        if color_ids:
            product.colors.set(color_ids)
        if size_ids:
            product.sizes.set(size_ids)
        
        return product

    def update(self, instance, validated_data):
        # Extract many-to-many field data
        color_ids = validated_data.pop('color_ids', None)
        size_ids = validated_data.pop('size_ids', None)
        
        # Extract foreign key IDs
        category_id = validated_data.pop('category_id', None)
        subcategory_id = validated_data.pop('subcategory_id', None)
        brand_id = validated_data.pop('brand_id', None)
        
        # Set foreign key objects
        if category_id is not None:
            validated_data['category_id'] = category_id
        if subcategory_id is not None:
            validated_data['subcategory_id'] = subcategory_id
        if brand_id is not None:
            validated_data['brand_id'] = brand_id
        
        # Update the product
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update many-to-many relationships
        if color_ids is not None:
            instance.colors.set(color_ids)
        if size_ids is not None:
            instance.sizes.set(size_ids)
        
        return instance
