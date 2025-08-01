from django.urls import path
from .views import ComplaintCreateView, ComplaintListView, ComplaintResolveView

urlpatterns = [
    path('complaints/create/', ComplaintCreateView.as_view(), name='complaint-create'),
    path('complaints/', ComplaintListView.as_view(), name='complaint-list'),
    path('complaints/<int:pk>/resolve/', ComplaintResolveView.as_view(), name='complaint-resolve'),
   
]