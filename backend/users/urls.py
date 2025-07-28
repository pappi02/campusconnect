
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
    VendorSettingsView,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('send-verification-code/', SendVerificationCodeView.as_view(), name='send_verification_code'),
    path('verify-code/', VerifyCodeView.as_view(), name='verify_code'),
    path('set-password/', SetPasswordView.as_view(), name='set_password'),
    path('login/', LoginView.as_view(), name='login'),
    # path('logout/', LogoutView.as_view(), name='logout'),  # Commented out because LogoutView is not defined
    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),
    path('payment-methods/', PaymentMethodListCreateView.as_view(), name='payment-method-list-create'),
    path('payment-methods/<int:pk>/', PaymentMethodDetailView.as_view(), name='payment-method-detail'),
    path('update-password/', UpdatePasswordView.as_view(), name='update-password'),
    path('vendor/settings/', VendorSettingsView.as_view(), name='vendor-settings'),
]


