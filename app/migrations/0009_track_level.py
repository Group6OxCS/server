# Generated by Django 2.0.2 on 2018-04-11 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_auto_20180223_1744'),
    ]

    operations = [
        migrations.AddField(
            model_name='track',
            name='level',
            field=models.CharField(default='', max_length=30),
            preserve_default=False,
        ),
    ]
