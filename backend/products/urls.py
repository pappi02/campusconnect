from django.urls import path
from .views import (
    ProductListCreateView, ProductDetailView, ProductFilterView, 
    CategoryListView, SubCategoryListView, BrandListView, ColorListView, SizeListView,
    ProductDetailImageCreateView, ReviewStarsView, SortOptionsView, RelatedProductsView
)

urlpatterns = [
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/filter/', ProductFilterView.as_view(), name='product-filter'),
    path('products/related/<int:pk>/', RelatedProductsView.as_view(), name='related-products'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('subcategories/', SubCategoryListView.as_view(), name='subcategory-list'),
    path('brands/', BrandListView.as_view(), name='brand-list'),
    path('colors/', ColorListView.as_view(), name='color-list'),
    path('sizes/', SizeListView.as_view(), name='size-list'),
    path('product-detail-images/', ProductDetailImageCreateView.as_view(), name='product-detail-image-create'),
    path('review-stars/', ReviewStarsView.as_view(), name='review-stars'),
    path('sort-options/', SortOptionsView.as_view(), name='sort-options'),
]
