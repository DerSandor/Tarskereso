from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, Http404
from django.core.exceptions import PermissionDenied
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from matches.serializers import MatchPairSerializer
from users.models import CustomUser
from django.utils.timezone import now
from matches.models import MatchPair
from django.db import models
import logging
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.core.cache import cache

logger = logging.getLogger(__name__)

class ConversationPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Eltávolítjuk a debug logokat
        return request.user in [obj.match.user1, obj.match.user2]

@method_decorator(cache_page(30), name='dispatch')  # 30 másodperces cache
class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        cache_key = f'conversations_user_{self.request.user.id}'
        cached_conversations = cache.get(cache_key)
        
        if cached_conversations is not None:
            return cached_conversations
            
        conversations = Conversation.objects.filter(
            match__in=MatchPair.objects.filter(
                Q(user1=self.request.user) | Q(user2=self.request.user)
            )
        )
        
        cache.set(cache_key, conversations, 30)  # 30 másodperces cache
        return conversations

class ConversationDetailView(generics.RetrieveAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated, ConversationPermission]
    queryset = Conversation.objects.all()

class ConversationCreateView(generics.CreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        match_id = request.data.get('match_id')
        match = get_object_or_404(MatchPair, id=match_id)
        
        # Ellenőrizzük, hogy létezik-e már beszélgetés ehhez a match-hez
        existing_conversation = Conversation.objects.filter(match=match).first()
        if existing_conversation:
            serializer = self.get_serializer(existing_conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Ellenőrizzük, hogy a felhasználó résztvevője-e a match-nek
        if not (match.user1 == request.user or match.user2 == request.user):
            raise PermissionDenied("Nem vagy résztvevője ennek a match-nek")
            
        serializer = self.get_serializer(data={'match': match_id})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        cache_key = f'messages_conv_{conversation_id}'
        
        cached_messages = cache.get(cache_key)
        if cached_messages is not None:
            return cached_messages

        conversation = get_object_or_404(Conversation, id=conversation_id)
        
        if self.request.user not in [conversation.match.user1, conversation.match.user2]:
            raise PermissionDenied("Nincs jogosultságod ehhez a beszélgetéshez!")
            
        messages = Message.objects.filter(conversation=conversation).order_by('created_at')
        
        # Cache-eljük az eredményt 10 másodpercre
        cache.set(cache_key, messages, 10)
        return messages

    def post(self, request, conversation_id):
        # Üzenet küldése után töröljük a cache-t
        cache.delete(f'messages_conv_{conversation_id}')
        return super().post(request, conversation_id)

class SendMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated, ConversationPermission]

    def perform_create(self, serializer):
        conversation = get_object_or_404(Conversation, id=self.kwargs['conversation_id'])
        self.check_object_permissions(self.request, conversation)
        
        message = serializer.save(sender=self.request.user, conversation=conversation)
        conversation.save()  # Ez frissíti az updated_at mezőt

@method_decorator(cache_page(30), name='dispatch')  # 30 másodperces cache
class MatchedUsersView(generics.ListAPIView):
    serializer_class = MatchPairSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MatchPair.objects.filter(
            Q(user1=self.request.user) | Q(user2=self.request.user),
            status='matched'
        )