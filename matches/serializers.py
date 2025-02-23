from rest_framework import serializers
from .models import Match, MatchPair
from users.serializers import UserSerializer

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'

class MatchPairSerializer(serializers.ModelSerializer):
    user1_username = serializers.CharField(source='user1.username', read_only=True)
    user2_username = serializers.CharField(source='user2.username', read_only=True)
    
    class Meta:
        model = MatchPair
        fields = ['id', 'user1_username', 'user2_username', 'status', 'created_at']
