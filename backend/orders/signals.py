from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, OrderItem
from notifications.models import Notification
from delivery.models import Delivery, DeliveryPersonProfile
from users.models import User
from delivery.services import send_new_order_whatsapp_alert

from .whatsapp_notifications import send_admin_whatsapp_notification
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Order)
def order_created_handler(sender, instance, created, **kwargs):
    if not created:
        return

    logger.info(f"Order post_save signal triggered for order {instance.id} with status {instance.status}")

    # Create a delivery record automatically when an order is placed
    if instance.status == 'order_placed':
        delivery, delivery_created = Delivery.objects.get_or_create(
            order=instance,
            defaults={'status': 'pending'}
        )
        if delivery_created:
            logger.info(f"Delivery record created for order {instance.id}")
    else:
        logger.warning(f"Order {instance.id} status is '{instance.status}', not 'order_placed'. Skipping delivery creation.")

    # Check if order has items, log if not but continue with admin notifications
    if not instance.items.exists():
        logger.warning(f"Order {instance.id} created without items - will proceed with admin notifications but skip vendor/customer notifications")
        # Still send admin WhatsApp notification for order status tracking
        pass

    # Send WhatsApp notification to admin for all relevant order statuses
    # This is sent regardless of whether items exist to ensure admin is notified of order placement
    if instance.status in ['paid', 'order_placed', 'pending']:
        logger.info(f"Sending WhatsApp notification to admin for order {instance.id} with status {instance.status}")
        
        try:
            # Use the centralized WhatsApp notification service
            message_sid = send_admin_whatsapp_notification(instance, "new_order")
            if message_sid:
                logger.info(f"WhatsApp notification sent successfully for order {instance.id}: {message_sid}")
            else:
                logger.warning(f"WhatsApp notification failed for order {instance.id}")
        except Exception as e:
            logger.error(f"Failed to send WhatsApp notification for order {instance.id}: {e}")

    # Send WhatsApp notification to all delivery persons
    if instance.status == 'order_placed':
        delivery_persons = User.objects.filter(role='delivery_person', is_active=True)
        for person in delivery_persons:
            send_new_order_whatsapp_alert(person, instance)

    # Continue with vendor and customer notifications only if items exist
    if not instance.items.exists():
        logger.info(f"Order {instance.id} still has no items, skipping vendor/customer notifications")
        return

    first_item = instance.items.first()
    if not first_item or not first_item.product:
        logger.warning(f"Order {instance.id} has invalid first item or product - skipping notifications")
        return

    vendor = first_item.product.vendor
    if vendor and vendor.user:
        try:
            Notification.objects.create(
                recipient=vendor.user,
                type='order_placed',
                message=f"New order received: #{instance.id}",
                channel='in_app',
                status='sent'
            )
            logger.info(f"Vendor notified for order {instance.id}")
        except Exception as e:
            logger.error(f"Error notifying vendor for order {instance.id}: {e}")
    else:
        logger.warning(f"Order {instance.id} has no associated vendor user")

    if instance.customer:
        try:
            Notification.objects.create(
                recipient=instance.customer,
                type='order_confirmation',
                message=f"Your order #{instance.id} has been placed successfully.",
                channel='in_app',
                status='sent'
            )
            logger.info(f"Customer notified for order {instance.id}")
        except Exception as e:
            logger.error(f"Error notifying customer for order {instance.id}: {e}")
    else:
        logger.warning(f"Order {instance.id} has no associated customer")
