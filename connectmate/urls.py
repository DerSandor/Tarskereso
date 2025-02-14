from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # 🔥 JWT token nézetek importálása
from django.http import JsonResponse  # 🔥 Hozzáadjuk a JsonResponse importot

# 🔥 Alapértelmezett gyökér URL nézet (ha valaki a http://127.0.0.1:8000/ oldalt nyitja meg)
def home_view(request):
    return JsonResponse({"message": "Üdvözöllek a ConnectMate API-nál! Használd az /api/ végpontokat."})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/profiles/', include('profiles.urls')),  # 🔥 Profilkezelés hozzáadása
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # 🔥 Token generálás útvonal
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # 🔥 Token frissítés útvonal
    path('api/messages/', include('messaging.urls')),  # Üzenetküldési API hozzáadása
    path('', home_view),  # 🔥 Most már definiált home_view nézetet használunk!
    path('api/matches/', include('matches.urls')),
    
]

from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
