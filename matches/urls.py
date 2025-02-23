from django.urls import path
from .views import (
    LikeDislikeView,
    NextProfileView,
    get_matched_users
)

urlpatterns = [
    path('like-dislike/', LikeDislikeView.as_view(), name='like-dislike'),
    path('next/', NextProfileView.as_view(), name='next-profile'),
    path('matched-users/', get_matched_users, name='matched-users'),
]
