from django.conf import settings
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.client = None
        self.whatsapp_from = None
        self.sms_from = None
        self._initialize_twilio()
    
    def _initialize_twilio(self):
        """Initialize Twilio client with credentials from settings"""
        try:
            if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
                self.client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                self.whatsapp_from = f'whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}'
                self.sms_from = settings.TWILIO_PHONE_NUMBER
                logger.info("Twilio client initialized successfully")
            else:
                logger.warning("Twilio credentials not found in settings")
        except Exception as e:
            logger.error(f"Failed to initialize Twilio client: {e}")
            self.client = None
    
    def send_whatsapp(self, to_number, message_body):
        """Send WhatsApp message using Twilio"""
        if not self.client:
            logger.error("Twilio client not initialized")
            return None
            
        try:
            # Ensure the to_number is in the correct format for WhatsApp
            if not to_number.startswith('whatsapp:'):
                to_number = f'whatsapp:{to_number}'
            
            message = self.client.messages.create(
                from_=self.whatsapp_from,
                body=message_body,
                to=to_number
            )
            logger.info(f"WhatsApp message sent successfully to {to_number}")
            return message.sid
        except TwilioRestException as e:
            logger.error(f"Failed to send WhatsApp message to {to_number}: {e}")
            return None
    
    def send_sms(self, to_number, message_body):
        """Send SMS message using Twilio"""
        if not self.client:
            logger.error("Twilio client not initialized")
            return None
            
        try:
            message = self.client.messages.create(
                from_=self.sms_from,
                body=message_body,
                to=to_number
            )
            logger.info(f"SMS sent successfully to {to_number}")
            return message.sid
        except TwilioRestException as e:
            logger.error(f"Failed to send SMS to {to_number}: {e}")
            return None

# Create a global instance of the notification service
notification_service = NotificationService()
