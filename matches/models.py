from django.db import models
from django.conf import settings

class Match(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="given_likes")
    liked_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_likes")
    liked = models.BooleanField(default=False)  # True, ha like, False, ha dislike
    
    class Meta:
        unique_together = ('user', 'liked_user')  # Egy user csak egyszer like-olhat egy másikat

    def __str__(self):
        return f"{self.user.username} {'❤️' if self.liked else '❌'} {self.liked_user.username}"
