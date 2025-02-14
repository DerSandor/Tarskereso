from django.urls import path
from .views import NextProfileView, LikeDislikeView

urlpatterns = [
    path('next/', NextProfileView.as_view(), name="next-profile"),
    path('like/', LikeDislikeView.as_view(), name="like-dislike"),
]
