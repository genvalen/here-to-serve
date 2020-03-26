# Generated by Django 3.0.4 on 2020-03-26 21:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CommunityUserRole',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('ADMIN', 'Administrator'), ('COMM_LEADER', 'Community Leader'), ('COORDINATOR', 'Coordinator'), ('COMM_MEMBER', 'Community Member')], default='COMM_MEMBER', max_length=11)),
                ('community', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.Community')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
