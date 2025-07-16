from rest_framework import serializers
from .models import Order
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), source='order', write_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order_id', 'amount', 'status', 'mpesa_code', 'timestamp']
        read_only_fields = ['id', 'status', 'mpesa_code', 'timestamp']
