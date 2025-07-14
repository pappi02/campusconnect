from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from .permissions import IsVendorOrReadOnly

from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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
        serializer.save(vendor=self.request.user)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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
