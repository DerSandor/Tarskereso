from django.contrib import admin
from .models import Profile
from django.utils.html import format_html

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'bio', 'interests', 'profile_image_preview')
    list_filter = ('gender',)  # Lehetővé teszi a nem szerinti szűrést
    search_fields = ('user__username', 'user__email', 'bio', 'interests')  # Keresési mezők

    def profile_image_preview(self, obj):
        if obj.profile_picture:
            return format_html('<img src="{}" width="100" height="100" style="object-fit: cover;" />', obj.profile_picture.url)
        return "Nincs kép"
    
    profile_image_preview.short_description = 'Profilkép'

admin.site.register(Profile, ProfileAdmin)
