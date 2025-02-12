from django.urls import path
from .views import ProfileDetailView, ProfileUpdateView

urlpatterns = [
    path('me/', ProfileDetailView.as_view(), name='my-profile'),  # Saját profil megtekintése
    path('me/edit/', ProfileUpdateView.as_view(), name='edit-profile'),  # Saját profil szerkesztése
]
