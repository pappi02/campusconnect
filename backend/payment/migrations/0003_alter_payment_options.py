# Generated by Django 5.1.4 on 2025-07-16 06:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0002_payment_gateway_response_payment_paid_at_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='payment',
            options={'ordering': ['-timestamp'], 'verbose_name': 'Payment', 'verbose_name_plural': 'Payments'},
        ),
    ]
