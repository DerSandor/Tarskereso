from django.db import models
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from users.models import CustomUser
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from django.conf import settings

User = get_user_model()

class Match(models.Model):
    user1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='likes_given')
    user2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='likes_received')
    liked = models.BooleanField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user1} -> {self.user2} ({'Liked' if self.liked else 'Disliked'})"

    class Meta:
        unique_together = ('user1', 'user2')

class MatchPair(models.Model):
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='matches_as_user1')
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='matches_as_user2')
    user1_likes = models.BooleanField(null=True)
    user2_likes = models.BooleanField(null=True)
    is_matched = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user1', 'user2')

    def __str__(self):
        return f"{self.user1.username} - {self.user2.username}"

    def save(self, *args, **kwargs):
        if self.user1_likes is True and self.user2_likes is True:
            self.is_matched = True
        else:
            self.is_matched = False
        super().save(*args, **kwargs)

    def get_other_user(self, user):
        """Visszaadja a másik felhasználót"""
        return self.user2 if user == self.user1 else self.user1

    def has_matched(self):
        """Ellenőrzi, hogy van-e match"""
        return self.user1_likes is True and self.user2_likes is True

# Automatikusan törli a MatchPair-t, ha a kapcsolódó Match törlődik
@receiver(post_delete, sender=Match)
def delete_matchpair(sender, instance, **kwargs):
    MatchPair.objects.filter(user1=instance.user1, user2=instance.user2).delete()
    MatchPair.objects.filter(user1=instance.user2, user2=instance.user1).delete()

@receiver(post_save, sender=MatchPair)
def update_match_status(sender, instance, **kwargs):
    """Frissíti a match státuszát, ha mindkét felhasználó like-olta egymást"""
    if instance.user1_likes and instance.user2_likes and not instance.is_matched:
        instance.is_matched = True
        instance.save()
