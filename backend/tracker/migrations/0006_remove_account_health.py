# Generated by Django 5.2 on 2025-04-23 09:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0005_account_credit_limit'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='health',
        ),
    ]
