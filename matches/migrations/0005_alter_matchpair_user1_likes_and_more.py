# Generated by Django 5.1.6 on 2025-02-23 17:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matches', '0004_remove_matchpair_status_matchpair_is_matched_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='matchpair',
            name='user1_likes',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='matchpair',
            name='user2_likes',
            field=models.BooleanField(null=True),
        ),
    ]
