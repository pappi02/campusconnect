from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Product, Category, SubCategory, Brand, Color, Size, ProductDetailImage
from .serializers import (
    ProductSerializer, CategorySerializer, SubCategorySerializer, 
    BrandSerializer, ColorSerializer, SizeSerializer, ProductDetailImageSerializer
)
from .permissions import IsVendorOrReadOnly

from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsVendorOrReadOnly]

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error in ProductListCreateView list: {e}", exc_info=True)
            from rest_framework.response import Response
            from rest_framework import status
            return Response({'detail': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_create(self, serializer):
        # Ensure the vendor is set to the current user
        serializer.save(vendor=self.request.user)

    def get_serializer_context(self):
        # Add request to serializer context for image URL generation
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsVendorOrReadOnly]

    def get_serializer_context(self):
        # Add request to serializer context for image URL generation
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class ProductFilterView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Implement filtering logic here if needed
        return super().get_queryset()

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error in CategoryListView list: {e}", exc_info=True)
            from rest_framework.response import Response
            from rest_framework import status
            return Response({'detail': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SubCategoryListView(generics.ListAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = SubCategory.objects.all()
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

class BrandListView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ColorListView(generics.ListAPIView):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class SizeListView(generics.ListAPIView):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductDetailImageCreateView(generics.CreateAPIView):
    queryset = ProductDetailImage.objects.all()
    serializer_class = ProductDetailImageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Ensure the product belongs to the current user (vendor)
        product = serializer.validated_data['product']
        if product.vendor != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only add images to your own products.")
        serializer.save()

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class ReviewStarsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Sample static data for review stars
        data = [
            {"id": 1, "stars": 1},
            {"id": 2, "stars": 2},
            {"id": 3, "stars": 3},
            {"id": 4, "stars": 4},
            {"id": 5, "stars": 5},
        ]
        return Response(data)

class SortOptionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Sample static data for sort options
        data = [
            {"id": 1, "name": "Price: Low to High", "value": "price_asc"},
            {"id": 2, "name": "Price: High to Low", "value": "price_desc"},
            {"id": 3, "name": "Newest Arrivals", "value": "newest"},
            {"id": 4, "name": "Best Sellers", "value": "best_sellers"},
        ]
        return Response(data)

class RelatedProductsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            related_products = Product.objects.filter(category=product.category).exclude(pk=pk)[:10]
            serializer = ProductSerializer(related_products, many=True)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=404)
