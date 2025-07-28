from django.core.management.base import BaseCommand
from django.conf import settings
from delivery.services import notification_service

class Command(BaseCommand):
    help = 'Test Twilio SMS and WhatsApp integration'

    def add_arguments(self, parser):
        parser.add_argument('phone_number', type=str, help='Phone number to test (e.g., +254712345678)')
        parser.add_argument('--sms', action='store_true', help='Test SMS notification')
        parser.add_argument('--whatsapp', action='store_true', help='Test WhatsApp notification')

    def handle(self, *args, **options):
        phone_number = options['phone_number']
        test_sms = options['sms']
        test_whatsapp = options['whatsapp']

        if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
            self.stdout.write(
                self.style.ERROR('Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your environment.')
            )
            return

        if not test_sms and not test_whatsapp:
            test_sms = True  # Default to SMS if no option specified

        if test_sms:
            self.stdout.write(f'Testing SMS to {phone_number}...')
            message_sid = notification_service.send_sms(
                phone_number,
                "🚚 CampusConnect Test: This is a test SMS from your delivery system. If you received this, Twilio is working correctly!"
            )
            if message_sid:
                self.stdout.write(self.style.SUCCESS(f'SMS sent successfully! Message SID: {message_sid}'))
            else:
                self.stdout.write(self.style.ERROR('Failed to send SMS'))

        if test_whatsapp:
            self.stdout.write(f'Testing WhatsApp to {phone_number}...')
            message_sid = notification_service.send_whatsapp(
                phone_number,
                "🚚 CampusConnect Test: This is a test WhatsApp message from your delivery system. If you received this, Twilio WhatsApp is working correctly!"
            )
            if message_sid:
                self.stdout.write(self.style.SUCCESS(f'WhatsApp message sent successfully! Message SID: {message_sid}'))
            else:
                self.stdout.write(self.style.ERROR('Failed to send WhatsApp message'))
