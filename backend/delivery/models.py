from django.db import models
from users.models import User
from orders.models import Order

class Delivery(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('picked_up', 'Picked Up'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='deliveries')
    delivery_person = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='deliveries')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    location = models.CharField(max_length=255, blank=True)  # Optional for tracking
    assigned_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Delivery {self.id} for Order {self.order.id} ({self.status})"

class DeliverySchedule(models.Model):
    SCHEDULE_TYPE_CHOICES = (
        ('once', 'Once'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    )

    delivery = models.OneToOneField(Delivery, on_delete=models.CASCADE, related_name='schedule')
    schedule_type = models.CharField(max_length=10, choices=SCHEDULE_TYPE_CHOICES, default='once')
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    additional_info = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Schedule for Delivery {self.delivery.id} - {self.schedule_type} at {self.scheduled_date} {self.scheduled_time}"
