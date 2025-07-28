from rest_framework import serializers
from .models import (
    Delivery, 
    DeliverySchedule, 
    DeliveryApplication, 
    DeliveryPersonProfile, 
    EarningsTransaction
)
from orders.models import Order
from users.models import User



class DeliveryFeeSerializer(serializers.Serializer):
    lat = serializers.FloatField()
    lng = serializers.FloatField()
    order_id = serializers.IntegerField(required=False)
    delivery_fee = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

class DeliverySerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    customer_phone = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    order_total = serializers.SerializerMethodField()
    
    class Meta:
        model = Delivery
        fields = [
            'id', 'order', 'delivery_person', 'status', 'location', 
            'assigned_at', 'updated_at', 'delivered_at', 'rating', 
            'customer_feedback', 'delivery_fee', 'tip', 'total_earnings',
            'customer_name', 'customer_phone', 'address', 'order_total'
        ]
        read_only_fields = ['id', 'assigned_at', 'updated_at', 'total_earnings']

    def get_customer_name(self, obj):
        if obj.order and obj.order.customer:
            return f"{obj.order.customer.first_name} {obj.order.customer.last_name}"
        return "Unknown Customer"

    def get_customer_phone(self, obj):
        if obj.order and obj.order.customer:
            return obj.order.customer.phone
        return "No Phone"

    def get_address(self, obj):
        if obj.order:
            return obj.order.delivery_address
        return "No Address"

    def get_order_total(self, obj):
        if obj.order:
            return str(obj.order.total_price)
        return "0.00"
        

class DeliveryAssignSerializer(serializers.Serializer):
    cart_id = serializers.IntegerField(required=False)

    delivery_person_id = serializers.IntegerField()

class DeliveryStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ['status', 'location', 'delivered_at']

class DeliveryScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliverySchedule
        fields = [
            'id', 'delivery_person', 'date', 'start_time', 'end_time', 
            'location', 'notes', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class DeliveryApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryApplication
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class DeliveryPersonProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    user_phone = serializers.SerializerMethodField()
    
    class Meta:
        model = DeliveryPersonProfile
        fields = [
            'id', 'user', 'user_name', 'user_email', 'user_phone', 'vehicle_type',
            'license_number', 'bank_account', 'payment_method', 'is_online',
            'max_delivery_distance', 'preferred_areas', 'total_earnings',
            'pending_earnings', 'available_balance', 'average_rating',
            'total_deliveries', 'profile_image', 'notify_new_orders',
            'notify_schedule_reminders', 'notify_earnings_updates',
            'notify_rating_alerts', 'auto_accept_orders', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_earnings', 
                           'pending_earnings', 'available_balance', 'average_rating', 
                           'total_deliveries']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_user_email(self, obj):
        return obj.user.email

    def get_user_phone(self, obj):
        return obj.user.phone

class EarningsTransactionSerializer(serializers.ModelSerializer):
    delivery_order_id = serializers.SerializerMethodField()
    
    class Meta:
        model = EarningsTransaction
        fields = [
            'id', 'delivery_person', 'transaction_type', 'amount', 'status',
            'description', 'delivery', 'delivery_order_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_delivery_order_id(self, obj):
        if obj.delivery and obj.delivery.order:
            return obj.delivery.order.id
        return None

class EarningsSummarySerializer(serializers.Serializer):
    total = serializers.CharField()
    today = serializers.CharField()
    week = serializers.CharField()
    month = serializers.CharField()
    pending = serializers.CharField()
    available = serializers.CharField()

class DeliveryEarningSerializer(serializers.Serializer):
    """Serializer for delivery earnings data"""
    total_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    pending_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    available_balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    today_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    week_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    month_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_deliveries = serializers.IntegerField()
    average_rating = serializers.FloatField()

class DeliveryHistorySerializer(serializers.ModelSerializer):
    """Serializer for delivery history"""
    customer_name = serializers.SerializerMethodField()
    order_total = serializers.SerializerMethodField()
    delivery_address = serializers.SerializerMethodField()
    
    class Meta:
        model = Delivery
        fields = [
            'id', 'order', 'status', 'delivered_at', 'delivery_fee', 
            'tip', 'total_earnings', 'rating', 'customer_feedback',
            'customer_name', 'order_total', 'delivery_address'
        ]
    
    def get_customer_name(self, obj):
        if obj.order and obj.order.customer:
            return f"{obj.order.customer.first_name} {obj.order.customer.last_name}"
        return "Unknown Customer"
    
    def get_order_total(self, obj):
        if obj.order:
            return str(obj.order.total_price)
        return "0.00"
    
    def get_delivery_address(self, obj):
        if obj.order:
            return obj.order.delivery_address
        return "No Address"

class DeliveryTransactionSerializer(serializers.ModelSerializer):
    """Serializer for delivery transactions"""
    order_id = serializers.SerializerMethodField()
    order_total = serializers.SerializerMethodField()
    
    class Meta:
        model = EarningsTransaction
        fields = [
            'id', 'delivery_person', 'transaction_type', 'amount', 
            'status', 'description', 'delivery', 'order_id', 
            'order_total', 'created_at'
        ]
    
    def get_order_id(self, obj):
        if obj.delivery and obj.delivery.order:
            return obj.delivery.order.id
        return None
    
    def get_order_total(self, obj):
        if obj.delivery and obj.delivery.order:
            return str(obj.delivery.order.total_price)
        return "0.00"

class DeliverySettingsSerializer(serializers.Serializer):
    """Serializer for delivery settings"""
    is_online = serializers.BooleanField()
    max_delivery_distance = serializers.IntegerField()
    preferred_areas = serializers.CharField(allow_blank=True)
    auto_accept_orders = serializers.BooleanField()
    notify_new_orders = serializers.BooleanField()
    notify_schedule_reminders = serializers.BooleanField()
    notify_earnings_updates = serializers.BooleanField()
    notify_rating_alerts = serializers.BooleanField()
