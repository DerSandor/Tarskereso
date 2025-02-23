from django.db import models
from django.conf import settings
from matches.models import MatchPair
from django.contrib.auth import get_user_model

User = get_user_model()

class Conversation(models.Model):
    match = models.OneToOneField(MatchPair, on_delete=models.CASCADE, related_name='conversation', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def get_participants(self):
        return [self.match.user1, self.match.user2]

    def can_participate(self, user):
        return user in self.get_participants()

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender.username}: {self.content[:50]}"

