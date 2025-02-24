from django.contrib import admin
from .models import Conversation, Message

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_user1', 'get_user2', 'created_at', 'updated_at']
    search_fields = ['match__user1__username', 'match__user2__username']
    list_filter = ['created_at', 'updated_at']

    def get_user1(self, obj):
        return obj.match.user1
    get_user1.short_description = 'User 1'

    def get_user2(self, obj):
        return obj.match.user2
    get_user2.short_description = 'User 2'

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'conversation', 'sender', 'content', 'created_at', 'is_read']
    list_filter = ['created_at', 'is_read']
    search_fields = ['content', 'sender__username']
    raw_id_fields = ['conversation', 'sender']
