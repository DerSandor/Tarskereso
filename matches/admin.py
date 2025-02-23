from django.contrib import admin
from .models import Match, MatchPair

class MatchAdmin(admin.ModelAdmin):
    list_display = ("user1", "user2", "liked", "created_at")
    list_filter = ("liked",)

class MatchPairAdmin(admin.ModelAdmin):
    list_display = ("user1", "user2", "created_at")

admin.site.register(Match, MatchAdmin)
admin.site.register(MatchPair, MatchPairAdmin)
