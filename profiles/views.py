from django.http import Http404
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage

# Profil megtekintése
class ProfileDetailView(generics.RetrieveAPIView):  
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return self.request.user.profile
        except Profile.DoesNotExist:
            raise Http404("Ehhez a felhasználóhoz nincs profil létrehozva.")

# Profil szerkesztése
class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        try:
            return self.request.user.profile
        except Profile.DoesNotExist:
            raise Http404("Ehhez a felhasználóhoz nincs profil létrehozva.")

    def perform_update(self, serializer):
        profile = self.get_object()

        # Ellenőrizzük, hogy van-e már meglévő profilkép
        if self.request.FILES.get('profile_picture') and profile.profile_picture:
            # Töröljük az előző profilképet
            if default_storage.exists(profile.profile_picture.path):
                default_storage.delete(profile.profile_picture.path)

        # Mentjük az új adatokat
        serializer.save()

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    
    def get_object(self):
        try:
            profile = Profile.objects.get(user_id=self.kwargs['user_id'])
            return profile
        except Profile.DoesNotExist:
            raise Http404("A profil nem található.")


