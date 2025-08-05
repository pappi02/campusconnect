from django.core.management.base import BaseCommand
from orders.models import Order
from orders.whatsapp_notifications import send_admin_whatsapp_notification
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Tests the WhatsApp notification functionality by sending a test message'

    def handle(self, *args, **options):
        try:
            # Create a mock order to test the notification
            mock_order = Order.objects.first()
            if not mock_order:
                logger.error("No orders found in the database. Please create an order to test the notification.")
                return

            # Send the test notification
            message_sid = send_admin_whatsapp_notification(mock_order, "test_notification")
            
            if message_sid:
                self.stdout.write(self.style.SUCCESS(f"Test WhatsApp notification sent successfully: {message_sid}"))
            else:
                self.stdout.write(self.style.WARNING("Failed to send test WhatsApp notification. Check logs for details."))

        except Exception as e:
            logger.error(f"An error occurred while sending the test WhatsApp notification: {e}")
            self.stdout.write(self.style.ERROR("An error occurred. Check logs for details."))
