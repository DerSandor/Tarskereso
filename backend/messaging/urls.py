from django.urls import path
from .views import (
    ConversationListView, 
    ConversationDetailView, 
    MessageListView, 
    SendMessageView,
    ConversationCreateView,
    # ConversationDeleteView,  # Egyelőre kivesszük
    # MessageDeleteView,  # Egyelőre kivesszük
)

urlpatterns = [
    # Beszélgetések kezelése
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('conversations/<int:conversation_id>/messages/', MessageListView.as_view(), name='message-list'),
    path('conversations/<int:conversation_id>/messages/send/', SendMessageView.as_view(), name='send-message'),
    
    # További javasolt végpontok
    path('conversations/create/', ConversationCreateView.as_view(), name='conversation-create'),
    # path('conversations/<int:pk>/delete/', ConversationDeleteView.as_view(), name='conversation-delete'),  # Egyelőre kivesszük
    # path('conversations/<int:conversation_id>/messages/<int:pk>/delete/', MessageDeleteView.as_view(), name='message-delete'),  # Egyelőre kivesszük
]

