from django.db import models
from orders.models import Order, User, OrderItem
from django.contrib.auth import get_user_model

class Payment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # M-Pesa or Paystack code or reference
    mpesa_code = models.CharField(
        max_length=100, unique=True, blank=True, null=True,
        help_text="Transaction reference (e.g., Paystack or M-Pesa code)"
    )

    # Raw response from gateway (JSON string)
    gateway_response = models.TextField(blank=True, null=True)

    # Payment completion time
    paid_at = models.DateTimeField(blank=True, null=True)

    # Creation time
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Payment"
        verbose_name_plural = "Payments"

    def __str__(self):
        return f"Payment {self.id} for Order {self.order.id} ({self.status})"

    def mark_completed(self, mpesa_code=None, response_data=None, paid_at=None):
        """Convenience method to mark payment as completed"""
        self.status = 'completed'
        if mpesa_code:
            self.mpesa_code = mpesa_code
        if response_data:
            self.gateway_response = response_data
        if paid_at:
            self.paid_at = paid_at
        self.save()



User = get_user_model()

class VendorPayout(models.Model):
    vendor = models.ForeignKey(User, on_delete=models.CASCADE)
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
    amount_sent = models.DecimalField(max_digits=10, decimal_places=2)
    commission_taken = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vendor.email} - {self.amount_sent} ({self.status})"
