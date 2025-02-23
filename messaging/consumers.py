import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, Conversation
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Csatlakozás a WebSocket szobához egy adott beszélgetés ID alapján"""
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'
        self.user = self.scope["user"]

        # Ellenőrizzük a jogosultságot
        if not await self.can_access_conversation():
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        """Kilépés a szobából"""
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    @database_sync_to_async
    def can_access_conversation(self):
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            return self.user in conversation.get_participants()
        except Conversation.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, content):
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            message = Message.objects.create(
                conversation=conversation,
                sender=self.user,
                content=content
            )
            return {
                'id': message.id,
                'content': message.content,
                'sender_name': message.sender.username,
                'created_at': message.created_at.isoformat(),
                'is_read': message.is_read
            }
        except Exception as e:
            print(f"Error saving message: {e}")
            return None

    async def receive(self, text_data):
        """Üzenet fogadása és mentése az adatbázisba"""
        try:
            data = json.loads(text_data)
            message = data['message']
            
            # Üzenet mentése az adatbázisba
            saved_message = await self.save_message(message['content'])
            
            if saved_message:
                # Üzenet küldése a csoportnak
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': saved_message
                    }
                )
        except Exception as e:
            print(f"Error in receive: {e}")

    async def chat_message(self, event):
        """WebSocket események küldése"""
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def get_user(self, user_id):
        """Felhasználó lekérése ID alapján"""
        try:
            return await User.objects.aget(id=user_id)
        except User.DoesNotExist:
            return None

    async def get_conversation(self, conversation_id):
        """Beszélgetés lekérése ID alapján"""
        try:
            return await Conversation.objects.aget(id=conversation_id)
        except Conversation.DoesNotExist:
            return None

    async def create_message(self, sender, conversation, content):
        """Új üzenet mentése az adatbázisba"""
        return await Message.objects.acreate(sender=sender, conversation=conversation, content=content)
