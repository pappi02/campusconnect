from django.urls import path
from .views import CartView, OrderListCreateView, OrderDetailView, OrderStatusView, CouponApplyView, CouponCreateView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:pk>/status/', OrderStatusView.as_view(), name='order-status'),
    path('coupon/apply/', CouponApplyView.as_view(), name='coupon-apply'),
    path('coupon/create/', CouponCreateView.as_view(), name='coupon-create'),
    
]
