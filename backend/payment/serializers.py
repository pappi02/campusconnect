from rest_framework import serializers
from .models import Order
from .models import Payment, VendorPayout
from rest_framework import generics, permissions

class PaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), source='order', write_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order_id', 'amount', 'status', 'mpesa_code', 'timestamp']
        read_only_fields = ['id', 'status', 'mpesa_code', 'timestamp']



class VendorPayoutSerializer(serializers.ModelSerializer):
    vendor_email = serializers.EmailField(source="vendor.email", read_only=True)
    order_reference = serializers.SerializerMethodField()

    class Meta:
        model = VendorPayout
        fields = [
            'id', 'vendor_email', 'order_reference',
            'amount_sent', 'commission_taken',
            'status', 'created_at'
        ]

    def get_order_reference(self, obj):
        return obj.order_item.order.reference if obj.order_item.order else None