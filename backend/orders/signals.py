from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from delivery.services import notification_service
from delivery.models import DeliveryPersonProfile
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@receiver(post_save, sender='orders.Order')
def notify_delivery_persons_on_new_order(sender, instance, created, **kwargs):
    """
    Send WhatsApp notifications to all available delivery persons when a new order is placed.
    This implements first-come-first-serve delivery assignment.
    """
    if created and instance.status == 'order_placed':
        # Get all available delivery persons
        available_delivery_persons = User.objects.filter(
            delivery_profile__is_online=True,
            delivery_profile__is_available=True,
            phone_number__isnull=False
        ).exclude(phone_number='')
        
        # Send WhatsApp notification to each delivery person
        for delivery_person in available_delivery_persons:
            try:
                message = f"""
🚚 NEW DELIVERY ORDER #{instance.id}

Customer: {instance.customer.first_name} {instance.customer.last_name}
Items: {instance.items.count()} items
Total: KES {instance.total_price}

Reply ACCEPT to claim this order or visit the app to accept it.

Order expires in 15 minutes!
"""
                
                # Use the test number for now
                test_phone = "+254790010567"
                message_sid = notification_service.send_whatsapp(
                    test_phone,
                    message.strip()
                )
                
                if message_sid:
                    logger.info(f"WhatsApp notification sent to {delivery_person.phone_number} for order {instance.id}")
                else:
                    logger.warning(f"Failed to send WhatsApp notification to {delivery_person.phone_number}")
                    
            except Exception as e:
                logger.error(f"Error sending notification to {delivery_person.phone_number}: {e}")
