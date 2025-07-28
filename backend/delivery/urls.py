from django.urls import path
from .views import (
    DeliveryListView, 
    DeliveryAssignView, 
    DeliveryStatusView, 
    DeliveryScheduleView,
    DeliveryScheduleDetailView,
    DeliveryApplicationView,
    DeliveryDashboardView,
    DeliveryStatusToggleView,
    AvailableDeliveriesView,
    AcceptDeliveryView,
    AcceptOrderView,
    DeliveryEarningsView,

    DeliveryHistoryView,
    EarningsTransactionView,
    DeliverySettingsView,
    DeliveryProfileImageView,
    calculate_delivery_fee
)

urlpatterns = [
    path('deliveries/', DeliveryListView.as_view(), name='delivery-list'),
    path('deliveries/assign/', DeliveryAssignView.as_view(), name='delivery-assign'),
    path('deliveries/<int:pk>/status/', DeliveryStatusView.as_view(), name='delivery-status'),
    path('delivery/schedule/', DeliveryScheduleView.as_view(), name='delivery-schedule'),
    path('delivery/schedule/<int:pk>/', DeliveryScheduleDetailView.as_view(), name='delivery-schedule-detail'),
    path('delivery/apply/', DeliveryApplicationView.as_view(), name='delivery-apply'),
    path('delivery/dashboard/', DeliveryDashboardView.as_view(), name='delivery-dashboard'),
    path('delivery/status/', DeliveryStatusToggleView.as_view(), name='delivery-status-toggle'),
    path('delivery/available/', AvailableDeliveriesView.as_view(), name='available-deliveries'),
    path('delivery/<int:delivery_id>/accept/', AcceptDeliveryView.as_view(), name='accept-delivery'),
    path('accept/<int:order_id>/', AcceptOrderView.as_view(), name='accept-order'),

    path('delivery/earnings/', DeliveryEarningsView.as_view(), name='delivery-earnings'),
    path('delivery/history/', DeliveryHistoryView.as_view(), name='delivery-history'),
    path('delivery/transactions/', EarningsTransactionView.as_view(), name='earnings-transactions'),
    path('delivery/settings/', DeliverySettingsView.as_view(), name='delivery-settings'),
    path('delivery/upload-profile-image/', DeliveryProfileImageView.as_view(), name='delivery-upload-image'),
    path('delivery/calculate-fee/', calculate_delivery_fee.as_view(), name='calculate-delivery-fee'),
]
