from django.db import models
from django.db.models import Q 
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from .models import Match, MatchPair
from users.models import CustomUser
from .serializers import MatchSerializer, MatchPairSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

class MatchListView(ListAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer


class LikeDislikeView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        print("\n=== LikeDislikeView called ===")
        print("Received data:", request.data)
        
        liked_user_id = request.data.get("liked_user_id")
        liked = request.data.get("liked", False)

        if not liked_user_id:
            return Response(
                {"error": "Hiányzó liked_user_id", "received_data": request.data}, 
                status=400
            )

        try:
            liked_user = CustomUser.objects.get(id=liked_user_id)
            current_user = request.user

            print(f"Processing: {current_user.username} {'likes' if liked else 'dislikes'} {liked_user.username}")

            # Keressük meg vagy hozzuk létre a MatchPair-t
            match_pair = MatchPair.objects.filter(
                (Q(user1=current_user, user2=liked_user) |
                 Q(user1=liked_user, user2=current_user))
            ).first()

            if match_pair:
                print(f"Found existing match pair: {match_pair}")
                print(f"Before update: user1_likes={match_pair.user1_likes}, user2_likes={match_pair.user2_likes}")
                
                # Frissítjük a megfelelő like státuszt
                if match_pair.user1 == current_user:
                    match_pair.user1_likes = liked  # Most már False értéket állítunk be None helyett
                else:
                    match_pair.user2_likes = liked  # Itt is False értéket állítunk be
            else:
                print("Creating new match pair")
                match_pair = MatchPair(
                    user1=current_user,
                    user2=liked_user,
                    user1_likes=liked  # Itt is False értéket állítunk be
                )

            match_pair.save()
            print(f"After save: user1_likes={match_pair.user1_likes}, user2_likes={match_pair.user2_likes}")
            print(f"Is matched: {match_pair.is_matched}")

            return Response({
                "match": match_pair.has_matched(),
                "message": "Match létrejött!" if match_pair.has_matched() else "Like/Dislike mentve."
            })

        except CustomUser.DoesNotExist:
            return Response(
                {"error": "A megadott felhasználó nem található"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error in LikeDislikeView: {str(e)}")
            return Response(
                {"error": "Hiba történt a művelet során", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class NextProfileView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        print(f"\nNextProfileView called for user: {user.username}")

        # Lekérjük azokat a MatchPair-eket, ahol a felhasználó szerepel
        my_matches = MatchPair.objects.filter(
            Q(user1=user) | Q(user2=user)
        )

        # Kizárandó felhasználók listája
        excluded_users = set([user.id])  # Saját magát mindenképp kizárjuk
        
        for match in my_matches:
            print(f"Found match: {match.user1.username} -> {match.user2.username}")
            print(f"  user1_likes: {match.user1_likes}, user2_likes: {match.user2_likes}")
            
            if match.user1 == user:
                # Ha én vagyok user1 és már döntöttem (akár like, akár dislike)
                if match.user1_likes is not None or match.user1_likes is False:  # Most már a False értéket is figyeljük
                    excluded_users.add(match.user2.id)
                    print(f"  Excluding user2: {match.user2.username} (I decided as user1: {match.user1_likes})")
            else:
                # Ha én vagyok user2 és már döntöttem (akár like, akár dislike)
                if match.user2_likes is not None or match.user2_likes is False:  # Itt is figyeljük a False értéket
                    excluded_users.add(match.user1.id)
                    print(f"  Excluding user1: {match.user1.username} (I decided as user2: {match.user2_likes})")

        print(f"Total excluded users: {excluded_users}")

        # Lekérjük a potenciális matcheket
        potential_matches = CustomUser.objects.exclude(
            id__in=excluded_users
        ).select_related('profile')

        print(f"Found {potential_matches.count()} potential matches")
        for match in potential_matches:
            print(f"  - {match.username}")

        if potential_matches.exists():
            # Random sorrendben választunk egy következő profilt
            next_user = potential_matches.order_by('?').first()
            profile = next_user.profile

            response_data = {
                "id": next_user.id,
                "username": next_user.username,
                "bio": profile.bio or "",
                "interests": profile.interests or "",
                "profile_picture": getImageUrl(profile.profile_picture) if profile.profile_picture else None
            }
            print(f"Sending response: {response_data}")
            return Response(response_data)

        print("No potential matches found")
        return Response({
            "message": "Nincsenek több megjeleníthető profilok"
        })

def getImageUrl(profile_picture):
    if not profile_picture:
        return None
    url = profile_picture.url
    if not url.startswith(('http://', 'https://')):
        return f"http://127.0.0.1:8000{url}"
    return url


@method_decorator(cache_page(30), name='dispatch')
class MatchedUsersView(generics.ListAPIView):
    serializer_class = MatchPairSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        cache_key = f'matched_users_{self.request.user.id}'
        cached_matches = cache.get(cache_key)
        
        if cached_matches is not None:
            return cached_matches
            
        matches = MatchPair.objects.filter(
            Q(user1=self.request.user) | Q(user2=self.request.user),
            status='matched'
        )
        
        cache.set(cache_key, matches, 30)
        return matches


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_matched_users(request):
    try:
        user = request.user
        print(f"User {user.username} requesting matches")
        
        # Csak az egyedi match-eket kérjük le
        matches = MatchPair.objects.filter(
            (Q(user1=user) | Q(user2=user)) &
            Q(is_matched=True)
        ).select_related(
            'user1', 'user2', 
            'user1__profile', 'user2__profile'
        ).distinct()  # Csak egyedi rekordok

        print(f"Found {matches.count()} unique matches")
        
        matched_users = []
        seen_match_ids = set()  # A már feldolgozott match-ek követése
        
        for match in matches:
            # Ha már feldolgoztuk ezt a match-et, akkor kihagyjuk
            if match.id in seen_match_ids:
                continue
                
            seen_match_ids.add(match.id)
            
            # Csak a másik felhasználót vesszük figyelembe
            other_user = match.user2 if match.user1 == user else match.user1
            print(f"Processing match: {user.username} - {other_user.username}")
            
            # A másik felhasználó profilja
            other_user_profile = other_user.profile if hasattr(other_user, 'profile') else None
            
            matched_users.append({
                'id': match.id,
                'user1_username': user.username,
                'user2_username': other_user.username,
                'other_user_profile': {  # Átnevezve, hogy egyértelműbb legyen
                    'profile_picture': other_user_profile.profile_picture.url if other_user_profile and other_user_profile.profile_picture else None,
                } if other_user_profile else None,
                'created_at': match.created_at,
                'is_matched': match.is_matched
            })

        print(f"Returning {len(matched_users)} unique matches")
        return Response(matched_users)
    except Exception as e:
        print(f"Error in get_matched_users: {str(e)}")
        return Response(
            {"error": f"Hiba történt a match-ek lekérésekor: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

