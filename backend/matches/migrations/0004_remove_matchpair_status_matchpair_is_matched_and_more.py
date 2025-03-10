# Generated by Django 5.1.6 on 2025-02-22 14:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matches', '0003_matchpair_status_alter_match_liked_alter_match_user1_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='matchpair',
            name='status',
        ),
        migrations.AddField(
            model_name='matchpair',
            name='is_matched',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='matchpair',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='matchpair',
            name='user1_likes',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='matchpair',
            name='user2_likes',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='matchpair',
            name='user1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches_as_user1', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='matchpair',
            name='user2',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches_as_user2', to=settings.AUTH_USER_MODEL),
        ),
    ]
