from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from orders.models import Order
from payment.models import Payment
from delivery.models import Delivery
from core_admin.models import Complaint
from notifications.services import notification_service
from .models import Notification


# Helper function to send in-app notification
def send_in_app_notification(recipient, notification_type, message):
    channel_layer = get_channel_layer()
    if channel_layer is None:
        # Channel layer not configured, skip sending in-app notification
        Notification.objects.create(
            recipient=recipient,
            type=notification_type,
            channel='in_app',
            message=message,
            status='failed'
        )
        return
    async_to_sync(channel_layer.group_send)(
        f"user_{recipient.id}",
        {
            'type': 'send_notification',
            'message': {
                'type': notification_type,
                'message': message,
                'created_at': str(Notification.objects.latest('created_at').created_at)
            }
        }
    )
    Notification.objects.create(
        recipient=recipient,
        type=notification_type,
        channel='in_app',
        message=message,
        status='sent'
    )

@receiver(post_save, sender=Order)
def send_order_placed_notification(sender, instance, created, **kwargs):
    if created and instance.customer:
        # SMS Notification
        customer_name = f"{instance.customer.first_name or ''} {instance.customer.last_name or ''}".strip()
        if not customer_name:
            customer_name = "Customer"
        message = f"Dear {customer_name}, your order #{instance.id} has been placed successfully."
        phone_number = instance.customer.phone
        try:
            message_sid = notification_service.send_sms(phone_number, message)
            if message_sid:
                Notification.objects.create(
                    recipient=instance.customer,
                    type='order_placed',
                    channel='sms',
                    message=message,
                    phone_number=phone_number,
                    status='sent'
                )
            else:
                raise Exception("Failed to send SMS")
        except Exception as e:
            Notification.objects.create(
                recipient=instance.customer,
                type='order_placed',
                channel='sms',
                message=message,
                phone_number=phone_number,
                status='failed'
            )
        # In-App Notification
        send_in_app_notification(instance.customer, 'order_placed', message)

@receiver(post_save, sender=Payment)
def send_payment_completed_notification(sender, instance, created, **kwargs):
    if instance.status == 'completed' and instance.order and instance.order.customer:
        # SMS Notification
        customer_name = f"{instance.order.customer.first_name or ''} {instance.order.customer.last_name or ''}".strip()
        if not customer_name:
            customer_name = "Customer"
        message = f"Dear {customer_name}, payment of KES {instance.amount} for Order #{instance.order.id} received. M-Pesa Code: {instance.mpesa_code}."
        phone_number = instance.order.customer.phone
        try:
            message_sid = notification_service.send_sms(phone_number, message)
            if message_sid:
                Notification.objects.create(
                    recipient=instance.order.customer,
                    type='payment_completed',
                    channel='sms',
                    message=message,
                    phone_number=phone_number,
                    status='sent'
                )
            else:
                raise Exception("Failed to send SMS")
        except Exception as e:
            Notification.objects.create(
                recipient=instance.order.customer,
                type='payment_completed',
                channel='sms',
                message=message,
                phone_number=phone_number,
                status='failed'
            )
        # In-App Notification
        send_in_app_notification(instance.order.customer, 'payment_completed', message)

@receiver(post_save, sender=Delivery)
def send_delivery_notifications(sender, instance, created, **kwargs):
    if created:
        # Customer SMS and In-App
        if instance.order and instance.order.customer:
            customer_name = f"{instance.order.customer.first_name or ''} {instance.order.customer.last_name or ''}".strip()
            if not customer_name:
                customer_name = "Customer"
            customer_message = f"Dear {customer_name}, your Order #{instance.order.id} has been assigned for delivery."
            try:
                message_sid = notification_service.send_sms(instance.order.customer.phone, customer_message)
                if message_sid:
                    Notification.objects.create(
                        recipient=instance.order.customer,
                        type='delivery_assigned',
                        channel='sms',
                        message=customer_message,
                        phone_number=instance.order.customer.phone,
                        status='sent'
                    )
                else:
                    raise Exception("Failed to send SMS")
            except Exception as e:
                Notification.objects.create(
                    recipient=instance.order.customer,
                    type='delivery_assigned',
                    channel='sms',
                    message=customer_message,
                    phone_number=instance.order.customer.phone,
                    status='failed'
                )
            send_in_app_notification(instance.order.customer, 'delivery_assigned', customer_message)

        # Delivery Person SMS and In-App
        if instance.delivery_person:
            delivery_name = f"{instance.delivery_person.first_name or ''} {instance.delivery_person.last_name or ''}".strip()
            if not delivery_name:
                delivery_name = "Delivery Person"
            delivery_message = f"Dear {delivery_name}, you have been assigned to deliver Order #{instance.order.id}."
            try:
                message_sid = notification_service.send_sms(instance.delivery_person.phone, delivery_message)
                if message_sid:
                    Notification.objects.create(
                        recipient=instance.delivery_person,
                        type='delivery_assigned',
                        channel='sms',
                        message=delivery_message,
                        phone_number=instance.delivery_person.phone,
                        status='sent'
                    )
                else:
                    raise Exception("Failed to send SMS")
            except Exception as e:
                Notification.objects.create(
                    recipient=instance.delivery_person,
                    type='delivery_assigned',
                    channel='sms',
                    message=delivery_message,
                    phone_number=instance.delivery_person.phone,
                    status='failed'
                )
            send_in_app_notification(instance.delivery_person, 'delivery_assigned', delivery_message)

    elif instance.status in ['picked_up', 'in_transit', 'delivered', 'cancelled']:
        # Customer SMS and In-App
        if instance.order and instance.order.customer:
            customer_name = f"{instance.order.customer.first_name or ''} {instance.order.customer.last_name or ''}".strip()
            if not customer_name:
                customer_name = "Customer"
            message = f"Dear {customer_name}, your Order #{instance.order.id} is now {instance.status} at {instance.location or 'unknown location'}."
            try:
                message_sid = notification_service.send_sms(instance.order.customer.phone, message)
                if message_sid:
                    Notification.objects.create(
                        recipient=instance.order.customer,
                        type='delivery_status',
                        channel='sms',
                        message=message,
                        phone_number=instance.order.customer.phone,
                        status='sent'
                    )
                else:
                    raise Exception("Failed to send SMS")
            except Exception as e:
                Notification.objects.create(
                    recipient=instance.order.customer,
                    type='delivery_status',
                    channel='sms',
                    message=message,
                    phone_number=instance.order.customer.phone,
                    status='failed'
                )
            send_in_app_notification(instance.order.customer, 'delivery_status', message)

@receiver(post_save, sender=Complaint)
def send_complaint_notifications(sender, instance, created, **kwargs):
    if created:
        # Customer SMS and In-App
        message = f"Dear {instance.user.first_name} {instance.user.last_name}, your complaint #{instance.id} for Order #{instance.order.id} has been received."
        try:
            message_sid = notification_service.send_sms(instance.user.phone, message)
            if message_sid:
                Notification.objects.create(
                    recipient=instance.user,
                    type='complaint_status',
                    channel='sms',
                    message=message,
                    phone_number=instance.user.phone,
                    status='sent'
                )
            else:
                raise Exception("Failed to send SMS")
        except Exception as e:
            Notification.objects.create(
                recipient=instance.user,
                type='complaint_status',
                channel='sms',
                message=message,
                phone_number=instance.user.phone,
                status='failed'
            )
        send_in_app_notification(instance.user, 'complaint_status', message)

    elif instance.status == 'resolved':
        # Customer SMS and In-App
        message = f"Dear {instance.user.first_name} {instance.user.last_name}, your complaint #{instance.id} for Order #{instance.order.id} has been resolved."
        try:
            message_sid = notification_service.send_sms(instance.user.phone, message)
            if message_sid:
                Notification.objects.create(
                    recipient=instance.user,
                    type='complaint_status',
                    channel='sms',
                    message=message,
                    phone_number=instance.user.phone,
                    status='sent'
                )
            else:
                raise Exception("Failed to send SMS")
        except Exception as e:
            Notification.objects.create(
                recipient=instance.user,
                type='complaint_status',
                channel='sms',
                message=message,
                phone_number=instance.user.phone,
                status='failed'
            )
        send_in_app_notification(instance.user, 'complaint_status', message)
