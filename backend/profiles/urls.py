from django.urls import path
from .views import ProfileDetailView, ProfileUpdateView, UserProfileView

urlpatterns = [
    path('me/', ProfileDetailView.as_view(), name='profile'),
    path('me/edit/', ProfileUpdateView.as_view(), name='edit-profile'),
    path('user/<int:user_id>/', UserProfileView.as_view(), name='user-profile'),  # Új útvonal
]
