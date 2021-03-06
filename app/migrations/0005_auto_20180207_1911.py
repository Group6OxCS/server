# Generated by Django 2.0.2 on 2018-02-07 19:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_script_parent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='script',
            name='name',
            field=models.CharField(max_length=30, unique=True),
        ),
        migrations.AlterField(
            model_name='script',
            name='parent',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.Script'),
        ),
        migrations.AlterField(
            model_name='track',
            name='name',
            field=models.CharField(max_length=30, unique=True),
        ),
    ]
