from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class ProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='testpass123')
        self.client.force_authenticate(user=self.user)

    def test_get_profile(self):
        response = self.client.get(reverse('my-profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_profile(self):
        data = {'bio': 'Updated bio', 'interests': 'coding'}
        response = self.client.patch(reverse('edit-profile'), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['bio'], 'Updated bio')
