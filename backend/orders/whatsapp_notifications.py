from notifications.services import notification_service
import logging

logger = logging.getLogger(__name__)

# Your WhatsApp number for all notifications
ADMIN_WHATSAPP_NUMBER = "+254790010567"


def send_admin_whatsapp_notification(order, notification_type="new_order"):
    """
    Send WhatsApp notification to admin for all order-related events.
    
    Args:
        order: The Order instance
        notification_type: Type of notification ('new_order', 'order_updated', etc.)
    """
    try:
        # Get vendor name
        vendor_name = "a local vendor"
        if order.items.exists():
            vendor = order.items.first().product.vendor
            vendor_name = f"{vendor.first_name} {vendor.last_name}".strip()

        # Get delivery address
        delivery_address = "Address not specified"
        customer_addresses = order.customer.addresses.filter(user=order.customer)
        if customer_addresses.exists():
            primary_address = customer_addresses.first()
            delivery_address = f"{primary_address.street_address}, {primary_address.city}"
        else:
            delivery_address = order.customer.location or "Address not specified"

        # Create appropriate message based on notification type
        if notification_type == "new_order":
            message_body = f"""
*📱 ADMIN NOTIFICATION - New Order Created!* 🛒

A new order has been placed and requires attention.

*Order ID:* #{order.id}
*From:* {vendor_name}
*To:* {delivery_address}
*Payment:* {order.status}
*Status:* {order.status}
*Total:* KES {order.total_price}
*Items:* {order.items.count()} items

*This notification is sent to admin for testing purposes*
Phone: +254790010567
"""
        elif notification_type == "order_updated":
            message_body = f"""
*📱 ADMIN NOTIFICATION - Order Updated!* 🔄

Order #{order.id} has been updated.

*Status:* {order.status}
*Payment Status:* {order.status}
*Total:* KES {order.total_price}

*This notification is sent to admin for testing purposes*
Phone: +254790010567
"""
        elif notification_type == "order_cancelled":
            message_body = f"""
*📱 ADMIN NOTIFICATION - Order Cancelled!* ❌

Order #{order.id} has been cancelled.

*Status:* {order.status}
*Total:* KES {order.total_price}

*This notification is sent to admin for testing purposes*
Phone: +254790010567
"""
        else:
            message_body = f"""
*📱 ADMIN NOTIFICATION - Order Event* 📋

Order #{order.id} - {notification_type}

*Status:* {order.status}
*Payment:* {order.status}
*Total:* KES {order.total_price}

*This notification is sent to admin for testing purposes*
Phone: +254790010567
"""

        # Send the WhatsApp message
        message_sid = notification_service.send_whatsapp(
            ADMIN_WHATSAPP_NUMBER,
            message_body.strip()
        )
        logger.info(f"Admin WhatsApp notification sent for order {order.id}: {message_sid}")
        return message_sid
    except Exception as e:
        logger.error(f"Error sending admin WhatsApp notification for order {order.id}: {e}")
        return None
