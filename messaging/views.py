from django.contrib.auth import get_user_model
from django.db import models
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Message
from .serializers import MessageSerializer

User = get_user_model()

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Lekérjük mind az elküldött, mind a fogadott üzeneteket
        return Message.objects.filter(
            models.Q(sender=user) | models.Q(receiver=user)
        ).order_by('-timestamp')

    def perform_create(self, serializer):
        receiver_id = self.request.data.get('receiver')

        if not receiver_id:
            raise ValidationError("A címzett azonosítója hiányzik.")

        serializer.save(sender=self.request.user, receiver_id=receiver_id)
