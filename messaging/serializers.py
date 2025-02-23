from rest_framework import serializers
from .models import Conversation, Message
from users.serializers import CustomUserSerializer
from matches.models import MatchPair

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'content', 'sender_name', 'created_at', 'is_read']
        read_only_fields = ['sender_name', 'created_at', 'is_read']

class ConversationSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    other_participant = serializers.SerializerMethodField()
    match = serializers.PrimaryKeyRelatedField(queryset=MatchPair.objects.all())

    class Meta:
        model = Conversation
        fields = ['id', 'match', 'created_at', 'updated_at', 'last_message', 'other_participant']
        read_only_fields = ['created_at', 'updated_at']

    def get_last_message(self, obj):
        if isinstance(obj, dict):
            return None
        last_message = obj.messages.last()
        if last_message:
            return MessageSerializer(last_message).data
        return None

    def get_other_participant(self, obj):
        request = self.context.get('request')
        if not request or not request.user:
            return None
            
        if isinstance(obj, dict):
            match = self.fields['match'].to_internal_value(obj.get('match'))
        else:
            match = obj.match
            
        if request.user == match.user1:
            return CustomUserSerializer(match.user2).data
        return CustomUserSerializer(match.user1).data

    def create(self, validated_data):
        match = validated_data.get('match')
        # Ellenőrizzük, hogy létezik-e már beszélgetés ehhez a match-hez
        existing_conversation = Conversation.objects.filter(match=match).first()
        if existing_conversation:
            return existing_conversation
        return super().create(validated_data)
