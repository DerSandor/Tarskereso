from django.urls import path
from .views import RegisterView, LoginView, ChangePasswordView, PasswordResetRequestView, PasswordResetConfirmView, SearchUsersView, GetUserIdView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('request-reset-password/', PasswordResetRequestView.as_view(), name='request-reset-password'),
    path('reset-password-confirm/', PasswordResetConfirmView.as_view(), name='reset-password-confirm'),
    path('search/', SearchUsersView.as_view(), name='search-users'),  # Új végpont kereséshez
    path('get-id/', GetUserIdView.as_view(), name='get-user-id'),  # Új végpont
]
