# Generated by Django 2.1.2 on 2018-11-20 19:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shoppingcartapp', '0006_auto_20181120_1555'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='image',
        ),
    ]