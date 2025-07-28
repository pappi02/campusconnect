from django.urls import path
from .views import verify_payment, paystack_webhook, VendorPayoutListView
urlpatterns = [
    path('verify-payment/', verify_payment),
    path('paystack-webhook/', paystack_webhook, name='paystack-webhook'),
    path('vendor-payouts/', VendorPayoutListView.as_view(), name='vendor-payouts'),

]
