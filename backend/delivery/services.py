from django.conf import settings
from notifications.services import notification_service
import logging



logger = logging.getLogger(__name__)


def send_new_order_whatsapp_alert(delivery_person, order):
    """Send WhatsApp notification to delivery person about new order"""
    if not delivery_person.phone:
        logger.warning(f"Delivery person {delivery_person.id} has no phone number")
        return
    
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
        
    message = f"""
*🚀 New Order Available for Delivery! 🚀*

A new order has been placed and is available for you to accept.

*Order Details:*
- *Order ID:* #{order.id}
- *From:* {vendor_name}
- *To:* {delivery_address}
- *Payment Status:* {order.status}
- *Total:* KES {order.total_price}
- *Items:* {order.items.count()} items

*Action:*
To accept this order, please visit the delivery dashboard in the app.

Thank you for being a part of CampusConnect!
"""
    
    return notification_service.send_whatsapp(delivery_person.phone, message.strip())

def send_sms_new_order_notification(delivery_person, order):
    """Send SMS notification to delivery person about new order"""
    if not delivery_person.phone:
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
    
    return notification_service.send_sms(delivery_person.phone, message.strip())

def send_sms_order_accepted(order, delivery_person):
    """Send SMS to customer when order is accepted by delivery person"""
    if not order.customer.phone:
        logger.warning(f"Customer {order.customer.id} has no phone number")
        return
    
    message = f"""
✅ ORDER ACCEPTED #{order.id}

Your order has been accepted by {delivery_person.first_name} {delivery_person.last_name}
Estimated delivery: 30-45 minutes
Track your order in the app

Thank you for choosing CampusConnect!
"""
    
    return notification_service.send_sms(order.customer.phone, message.strip())

def send_sms_order_picked_up(order):
    """Send SMS to customer when order is picked up"""
    if not order.customer.phone:
        logger.warning(f"Customer {order.customer.id} has no phone number")
        return
    
    message = f"""
📦 ORDER PICKED UP #{order.id}

Your order has been picked up and is on the way!
Track your delivery in real-time: https://localhost.com:5173/track/{order.id}

Estimated arrival: 15-20 minutes
"""
    
    return notification_service.send_sms(order.customer.phone, message.strip())

def send_sms_order_delivered(order):
    """Send SMS to customer when order is delivered"""
    if not order.customer.phone:
        logger.warning(f"Customer {order.customer.id} has no phone number")
        return
    
    message = f"""
🎉 ORDER DELIVERED #{order.id}

Your order has been successfully delivered!
Please rate your delivery experience in the app.

Thank you for using CampusConnect!
"""
    
    return notification_service.send_sms(order.customer.phone, message.strip())

def send_sms_delivery_assignment(delivery_person, order_assignment):
    """Send SMS to delivery person about order assignment"""
    if not delivery_person.phone:
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
    
    return notification_service.send_sms(delivery_person.phone, message.strip())

def send_sms_earnings_update(delivery_person, amount, transaction_type):
    """Send SMS to delivery person about earnings update"""
    if not delivery_person.phone:
        logger.warning(f"Delivery person {delivery_person.id} has no phone number")
        return
    
    message = f"""
💰 EARNINGS UPDATE

{transaction_type}: KES {amount}
New balance: KES {delivery_person.delivery_profile.available_balance}

Keep up the great work!
"""
    
    return notification_service.send_sms(delivery_person.phone, message.strip())
