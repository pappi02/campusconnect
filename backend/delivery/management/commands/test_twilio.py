from django.core.management.base import BaseCommand
from django.conf import settings
from notifications.services import notification_service
from users.models import User
from orders.models import Order

class Command(BaseCommand):
    help = 'Test Twilio SMS and WhatsApp integration'

    def add_arguments(self, parser):
        parser.add_argument('phone', type=str, help='Phone number to test (e.g., +254712345678)')
        parser.add_argument(
            '--type',
            type=str,
            choices=['sms', 'whatsapp'],
            default='sms',
            help='Type of notification to test'
        )

    def handle(self, *args, **options):
        phone = options['phone']
        test_type = options['type']

        if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
            self.stdout.write(
                self.style.ERROR('Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your environment.')
            )
            return

        if test_type == 'sms':
            self.stdout.write(f'Testing SMS to {phone}...')
            message_sid = notification_service.send_sms(
                phone,
                "🚚 CampusConnect Test: This is a test SMS from your delivery system. If you received this, Twilio is working correctly!"
            )
            if message_sid:
                self.stdout.write(self.style.SUCCESS(f'SMS sent successfully! Message SID: {message_sid}'))
            else:
                self.stdout.write(self.style.ERROR('Failed to send SMS'))

        elif test_type == 'whatsapp':
            self.stdout.write(f'Testing WhatsApp to {phone}...')
            message_sid = notification_service.send_whatsapp(
                phone,
                "🚚 CampusConnect Test: This is a test WhatsApp message from your delivery system. If you received this, Twilio WhatsApp is working correctly!"
            )
            if message_sid:
                self.stdout.write(self.style.SUCCESS(f'WhatsApp message sent successfully! Message SID: {message_sid}'))
            else:
                self.stdout.write(self.style.ERROR('Failed to send WhatsApp message'))
