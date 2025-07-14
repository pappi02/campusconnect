
from django.urls import path
from .views import (
    RegisterView,
    ProfileView,
    SendVerificationCodeView,
    VerifyCodeView,
    SetPasswordView,
    LoginView,
    AddressListCreateView,
    AddressDetailView,
    PaymentMethodListCreateView,
    PaymentMethodDetailView,
    UpdatePasswordView,
)
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('send-verification-code/', SendVerificationCodeView.as_view(), name='send_verification_code'),
    path('verify-code/', VerifyCodeView.as_view(), name='verify_code'),
    path('set-password/', SetPasswordView.as_view(), name='set_password'),
    path('login/', LoginView.as_view(), name='login'),
    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),
    path('payment-methods/', PaymentMethodListCreateView.as_view(), name='payment-method-list-create'),
    path('payment-methods/<int:pk>/', PaymentMethodDetailView.as_view(), name='payment-method-detail'),
    path('update-password/', UpdatePasswordView.as_view(), name='update-password'),
]
