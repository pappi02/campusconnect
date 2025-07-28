from django.conf import settings
from twilio.rest import Client
import logging

logger = logging.getLogger(__name__)

class TwilioNotificationService:
    """Service class for handling Twilio SMS and WhatsApp notifications"""
    
    def __init__(self):
        self.client = None
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            self.client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        else:
            logger.warning("Twilio credentials not configured")
    
    def send_sms(self, to_phone, message_body):
        """Send SMS notification"""
        if not self.client:
            logger.warning("Twilio client not initialized")
            return None
            
        try:
            message = self.client.messages.create(
                from_=settings.TWILIO_PHONE_NUMBER,
                body=message_body,
                to=f"+{to_phone}" if not str(to_phone).startswith('+') else to_phone
            )
            logger.info(f"SMS sent to {to_phone}: {message.sid}")
            return message.sid
        except Exception as e:
            logger.error(f"Failed to send SMS to {to_phone}: {e}")
            return None
    
    def send_whatsapp(self, to_phone, message_body):
        """Send WhatsApp notification"""
        if not self.client:
            logger.warning("Twilio client not initialized")
            return None
            
        try:
            message = self.client.messages.create(
                from_=f"whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}",
                body=message_body,
                to=f"whatsapp:+{to_phone}" if not str(to_phone).startswith('+') else f"whatsapp:{to_phone}"
            )
            logger.info(f"WhatsApp message sent to {to_phone}: {message.sid}")
            return message.sid
        except Exception as e:
            logger.error(f"Failed to send WhatsApp to {to_phone}: {e}")
            return None

# Initialize the service
notification_service = TwilioNotificationService()

def send_whatsapp_notification(delivery_person, order):
    """
    Sends a WhatsApp notification to a delivery person about a new order.
    """
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        logger.warning("Twilio credentials are not configured. Skipping WhatsApp notification.")
        return

    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    recipient_phone_number = f"whatsapp:{delivery_person.phone_number}"
    # This should be a pre-approved template on Twilio
    message_body = f"New delivery request! Order #{order.id}. To accept, click here: https://yourdomain.com/accept/{order.id}?agent={delivery_person.id}"
    
    try:
        message = client.messages.create(
            from_=f"whatsapp:{settings.TWILIO_PHONE_NUMBER}",
            body=message_body,
            to=recipient_phone_number
        )
        logger.info(f"WhatsApp notification sent to {recipient_phone_number}: {message.sid}")
    except Exception as e:
        logger.error(f"Failed to send WhatsApp notification to {recipient_phone_number}: {e}")

def send_sms_new_order_notification(delivery_person, order):
    """Send SMS notification to delivery person about new order"""
    if not delivery_person.phone_number:
        logger.warning(f"Delivery person {delivery_person.id} has no phone number")
        return
    
    message = f"""
🚚 NEW DELIVERY ORDER #{order.id}

Customer: {order.customer.first_name} {order.customer.last_name}
Address: {order.delivery_address}
Items: {order.items.count()} items
Total: KES {order.total_price}
Distance: {order.distance_km:.1f}km

Reply ACCEPT to take this order or visit the app.
"""
    
    return notification_service.send_sms(delivery_person.phone_number, message.strip())

def send_sms_order_accepted(order, delivery_person):
    """Send SMS to customer when order is accepted by delivery person"""
    if not order.customer.phone_number:
        logger.warning(f"Customer {order.customer.id} has no phone number")
        return
    
    message = f"""
✅ ORDER ACCEPTED #{order.id}

Your order has been accepted by {delivery_person.first_name} {delivery_person.last_name}
Estimated delivery: 30-45 minutes
Track your order in the app

Thank you for choosing CampusConnect!
"""
    
    return notification_service.send_sms(order.customer.phone_number, message.strip())

def send_sms_order_picked_up(order):
    """Send SMS to customer when order is picked up"""
    if not order.customer.phone_number:
        logger.warning(f"Customer {order.customer.id} has no phone number")
        return
    
    message = f"""
📦 ORDER PICKED UP #{order.id}

Your order has been picked up and is on the way!
Track your delivery in real-time: https://campusconnect.com/track/{order.id}

Estimated arrival: 15-20 minutes
"""
    
    return notification_service.send_sms(order.customer.phone_number, message.strip())

def send_sms_order_delivered(order):
    """Send SMS to customer when order is delivered"""
    if not order.customer.phone_number:
        logger.warning(f"Customer {order.customer.id} has no phone number")
        return
    
    message = f"""
🎉 ORDER DELIVERED #{order.id}

Your order has been successfully delivered!
Please rate your delivery experience in the app.

Thank you for using CampusConnect!
"""
    
    return notification_service.send_sms(order.customer.phone_number, message.strip())

def send_sms_delivery_assignment(delivery_person, order_assignment):
    """Send SMS to delivery person about order assignment"""
    if not delivery_person.phone_number:
        logger.warning(f"Delivery person {delivery_person.id} has no phone number")
        return
    
    message = f"""
🎯 ORDER ASSIGNED #{order_assignment.order.id}

New delivery assigned to you:
Customer: {order_assignment.order.customer.first_name}
Address: {order_assignment.order.delivery_address}
Distance: {order_assignment.distance_km:.1f}km
Earnings: KES {order_assignment.order.delivery_fee}

Expires in 15 minutes - accept quickly!
"""
    
    return notification_service.send_sms(delivery_person.phone_number, message.strip())

def send_sms_earnings_update(delivery_person, amount, transaction_type):
    """Send SMS to delivery person about earnings update"""
    if not delivery_person.phone_number:
        logger.warning(f"Delivery person {delivery_person.id} has no phone number")
        return
    
    message = f"""
💰 EARNINGS UPDATE

{transaction_type}: KES {amount}
New balance: KES {delivery_person.delivery_profile.available_balance}

Keep up the great work!
"""
    
    return notification_service.send_sms(delivery_person.phone_number, message.strip())
