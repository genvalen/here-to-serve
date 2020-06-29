# Generated by Django 3.0.4 on 2020-06-29 07:41

from django.db import migrations, models
import django.db.models.deletion
import tinymce.models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customsection',
            name='discussion_posts',
        ),
        migrations.RemoveField(
            model_name='customsection',
            name='resources',
        ),
        migrations.AddField(
            model_name='discussionpost',
            name='section',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='backend.CustomSection'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='customsection',
            name='general_content',
            field=tinymce.models.HTMLField(blank=True),
        ),
    ]
