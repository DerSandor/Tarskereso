from rest_framework import generics, permissions
from rest_framework.response import Response
from django.db.models import Q
from .models import Match
from users.models import CustomUser
from .serializers import MatchSerializer

class NextProfileView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        potential_matches = CustomUser.objects.exclude(
            id=request.user.id
        ).exclude(
            id__in=Match.objects.filter(user=request.user).values_list('liked_user', flat=True)
        )

        if potential_matches.exists():
            user = potential_matches.first()
            profile = getattr(user, 'profile', None)  # 🔥 Ellenőrizzük, hogy van-e profilja!

            return Response({
                "id": user.id,
                "username": user.username,
                "bio": profile.bio if profile else "",
                "interests": profile.interests if profile else "",
                "profile_picture": profile.profile_picture.url if profile and profile.profile_picture else None
            })

        return Response({"message": "Nincsenek több profilok."})

class LikeDislikeView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        liked_user_id = request.data.get("liked_user_id") or request.data.get("likedUserId")  # 🔥 Javítás
        liked = request.data.get("liked", False)

        if not liked_user_id:
            return Response({"error": "Hiányzó liked_user_id"}, status=400)

        liked_user = CustomUser.objects.filter(id=liked_user_id).first()
        if not liked_user:
            return Response({"error": "A felhasználó nem található"}, status=404)

        # Like/Dislike mentése
        match, created = Match.objects.get_or_create(user=request.user, liked_user=liked_user)
        match.liked = liked
        match.save()

        # Ellenőrizzük, hogy lett-e kölcsönös like
        if liked and Match.objects.filter(user=liked_user, liked_user=request.user, liked=True).exists():
            return Response({"match": True, "message": "It’s a match! Most már üzenetet küldhetsz!"})
        
        return Response({"match": False, "message": "Like mentve."})
