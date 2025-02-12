from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # 🔥 JWT token nézetek importálása

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/profiles/', include('profiles.urls')),  # 🔥 Profilkezelés hozzáadása
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # 🔥 Token generálás útvonal
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # 🔥 Token frissítés útvonal
    path('api/messages/', include('messaging.urls')),  # Üzenetküldési API hozzáadása
]

from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
