import logging  # Ez hiányzott

from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserRegisterSerializer, UserLoginSerializer, PasswordResetSerializer
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.db.models import Q

logger = logging.getLogger(__name__)  # Logger definiálása

User = get_user_model()

from .serializers import PasswordResetSerializer
from rest_framework import generics

class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email cím megadása kötelező.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Ez az email cím nincs regisztrálva.'}, status=status.HTTP_404_NOT_FOUND)

        # Token és UID generálása
        token = PasswordResetTokenGenerator().make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Jelszó visszaállító link létrehozása
        reset_link = f"http://localhost:5173/reset-password-confirm/{uid}/{token}/"


        # Email küldése
        send_mail(
            'Jelszó visszaállítás',
            f'Kérlek kattints az alábbi linkre a jelszavad visszaállításához: {reset_link}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        return Response({'message': 'A visszaállítási linket elküldtük az email címedre.'}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Érvénytelen link.'}, status=status.HTTP_400_BAD_REQUEST)

        if PasswordResetTokenGenerator().check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'message': 'A jelszó sikeresen megváltoztatva!'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Érvénytelen vagy lejárt token.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'A visszaállítási linket elküldtük az email címedre.'}, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer

    def post(self, request, *args, **kwargs):
        logger.info(f"Beérkezett adatok: {request.data}")  # Naplózza a beérkező adatokat
        
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            logger.info("Sikeres regisztráció!")
            return Response({"message": "Sikeres regisztráció!"}, status=status.HTTP_201_CREATED)

        logger.error(f"Regisztrációs hiba: {serializer.errors}")  # Naplózza a hibákat
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

class ChangePasswordView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not user.check_password(current_password):
            return Response({"error": "A jelenlegi jelszó helytelen."}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()

        return Response({"message": "A jelszó sikeresen megváltoztatva!"}, status=status.HTTP_200_OK)

class SearchUsersView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        query = request.GET.get('q', '')
        if query:
            users = User.objects.filter(Q(username__icontains=query) | Q(email__icontains=query))
        else:
            users = User.objects.none()
        
        user_data = [{"id": user.id, "username": user.username, "email": user.email} for user in users]
        return Response(user_data)

class GetUserIdView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        identifier = request.query_params.get('identifier')
        if not identifier:
            return Response({'error': 'Azonosító megadása kötelező.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=identifier)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=identifier)
            except User.DoesNotExist:
                return Response({'error': 'Felhasználó nem található.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'id': user.id})
