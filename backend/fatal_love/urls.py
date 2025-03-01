from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse
from django.views.generic import TemplateView

def home_view(request):
    return JsonResponse({"message": "Üdvözöllek a Fatal Love API-nál! Használd az /api/ végpontokat."})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/profiles/', include('profiles.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/messages/', include('messaging.urls')), 
    path('', home_view),
    path('api/matches/', include('matches.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Catch-all pattern a frontend route-okhoz
urlpatterns += [
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
]
