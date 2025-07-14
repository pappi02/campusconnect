from django.urls import path
from .views import ProductListCreateView, ProductDetailView, ProductFilterView, CategoryListView, ReviewStarsView, SortOptionsView, RelatedProductsView

urlpatterns = [
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/filter/', ProductFilterView.as_view(), name='product-filter'),
    path('products/related/<int:pk>/', RelatedProductsView.as_view(), name='related-products'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('review-stars/', ReviewStarsView.as_view(), name='review-stars'),
    path('sort-options/', SortOptionsView.as_view(), name='sort-options'),
]
