from django.db import models
from users.models import User
from orders.models import Order
from django.utils import timezone

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
    delivered_at = models.DateTimeField(null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    customer_feedback = models.TextField(blank=True, null=True)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tip = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Delivery {self.id} for Order {self.order.id} ({self.status})"

    @property
    def total_earnings(self):
        return self.delivery_fee + self.tip


class OrderAssignment(models.Model):
    """Tracks the assignment of orders to delivery persons"""
    ASSIGNMENT_STATUS = (
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    )
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='assignment')
    delivery_person = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order_assignments')
    assignment_score = models.FloatField(default=0.0)
    distance_km = models.FloatField(default=0.0)
    estimated_delivery_time = models.DateTimeField()
    assigned_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=ASSIGNMENT_STATUS, default='pending')
    
    class Meta:
        ordering = ['-assigned_at']
        indexes = [
            models.Index(fields=['assigned_at']),
            models.Index(fields=['delivery_person', 'status']),
            models.Index(fields=['expires_at']),
        ]


class DeliveryLocation(models.Model):
    """Real-time location tracking for delivery persons"""
    delivery_person = models.OneToOneField(User, on_delete=models.CASCADE, related_name='current_location')
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    accuracy = models.FloatField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.delivery_person.first_name} - {self.latitude}, {self.longitude}"


class DeliverySchedule(models.Model):
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('booked', 'Booked'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    delivery_person = models.ForeignKey(User, on_delete=models.CASCADE, related_name='delivery_schedules')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.delivery_person.first_name} - {self.date} {self.start_time}-{self.end_time}"

    class Meta:
        ordering = ['date', 'start_time']


class DeliveryPersonProfile(models.Model):
    VEHICLE_CHOICES = (
        ('motorcycle', 'Motorcycle'),
        ('car', 'Car'),
        ('bicycle', 'Bicycle'),
        ('truck', 'Truck'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='delivery_profile')
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_CHOICES, blank=True)
    license_number = models.CharField(max_length=50, blank=True)
    bank_account = models.CharField(max_length=50, blank=True)
    payment_method = models.CharField(max_length=20, default='bank')
    is_online = models.BooleanField(default=False)
    max_delivery_distance = models.IntegerField(default=10)
    preferred_areas = models.TextField(blank=True, help_text="Comma-separated list of preferred areas")
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    pending_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    available_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_deliveries = models.IntegerField(default=0)
    profile_image = models.ImageField(upload_to='delivery_profiles/', blank=True, null=True)
    
    # Location fields for assignment
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    
    # Notification preferences
    notify_new_orders = models.BooleanField(default=True)
    notify_schedule_reminders = models.BooleanField(default=True)
    notify_earnings_updates = models.BooleanField(default=True)
    notify_rating_alerts = models.BooleanField(default=True)
    
    # Delivery preferences
    auto_accept_orders = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - Delivery Profile"

    @property
    def current_load(self):
        """Get current number of assigned orders"""
        return OrderAssignment.objects.filter(
            delivery_person=self.user,
            status='assigned'
        ).count()

    @property
    def is_available(self):
        """Check if delivery person is available for new orders"""
        return self.is_online and self.current_load < 5


class EarningsTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('delivery', 'Delivery'),
        ('bonus', 'Bonus'),
        ('withdrawal', 'Withdrawal'),
        ('adjustment', 'Adjustment'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    delivery_person = models.ForeignKey(User, on_delete=models.CASCADE, related_name='earnings_transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    description = models.TextField()
    delivery = models.ForeignKey(Delivery, on_delete=models.SET_NULL, null=True, blank=True, related_name='earnings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.delivery_person.first_name} - {self.transaction_type} - ${self.amount}"

    class Meta:
        ordering = ['-created_at']


class DeliveryApplication(models.Model):
    ID_TYPE_CHOICES = (
        ('Student ID', 'Student ID'),
        ('National ID', 'National ID'),
        ('Passport', 'Passport'),
        ("Driver's License", "Driver's License"),
        ('Other', 'Other'),
    )
    
    TRANSPORTATION_CHOICES = (
        ('Walking', 'Walking (for short distances)'),
        ('Bicycle', 'Bicycle'),
        ('Motorcycle/Bodaboda', 'Motorcycle/Bodaboda'),
        ('Car', 'Car'),
        ('Scooter', 'Scooter'),
    )
    
    AVAILABILITY_CHOICES = (
        ('5-10 hours', '5-10 hours'),
        ('10-15 hours', '10-15 hours'),
        ('15-20 hours', '15-20 hours'),
        ('20+ hours', '20+ hours'),
    )
    
    YEAR_CHOICES = (
        ('1st Year', '1st Year'),
        ('2nd Year', '2nd Year'),
        ('3rd Year', '3rd Year'),
        ('4th Year', '4th Year'),
        ('Graduate', 'Graduate'),
        ('Postgraduate', 'Postgraduate'),
    )

    # User
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='delivery_application')
    
    # Identification
    id_type = models.CharField(max_length=20, choices=ID_TYPE_CHOICES)
    id_number = models.CharField(max_length=50, default='1')
    
    # Student Information (Optional)
    is_student = models.BooleanField(default=False)
    university = models.CharField(max_length=255, blank=True)
    year_of_study = models.CharField(max_length=20, choices=YEAR_CHOICES, blank=True)
    
    # Delivery Information
    transportation_mode = models.CharField(max_length=30, choices=TRANSPORTATION_CHOICES)
    available_hours = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES)
    has_license = models.BooleanField(default=False)
    
    # Emergency Contact
    emergency_contact = models.CharField(max_length=150, blank=True)
    emergency_phone = models.CharField(max_length=20, blank=True)
    
    # Additional Information
    motivation = models.TextField(blank=True)
    
    # Application Status
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Delivery Application - {self.user.first_name} {self.user.last_name} ({self.user.email})"

    class Meta:
        ordering = ['-created_at']
