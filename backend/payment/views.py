from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Payment, VendorPayout
from .serializers import PaymentSerializer, VendorPayoutSerializer
from orders.models import Order
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import requests
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
import json
from django.utils.dateparse import parse_datetime
from rest_framework import generics, permissions



   



PAYSTACK_SECRET_KEY = 'sk_live_f9dde8762fbe64731bd30a9b02ddb1c906c29daa'  # Replace with your actual Paystack secret


@csrf_exempt
@require_POST
def verify_payment(request):
    try:
        data = json.loads(request.body)
        reference = data.get('reference')
        if not reference:
            return JsonResponse({'error': 'Missing reference'}, status=400)

        headers = {
            'Authorization': f'Bearer {PAYSTACK_SECRET_KEY}',
            'Content-Type': 'application/json',
        }

        response = requests.get(f'https://api.paystack.co/transaction/verify/{reference}', headers=headers)
        result = response.json()

        if not result.get('status'):
            return JsonResponse({'error': 'Invalid Paystack response'}, status=400)

        pay_data = result.get('data', {})

        if pay_data.get('status') == 'success':
            metadata = pay_data.get('metadata', {})
            custom_fields = metadata.get('custom_fields', [])
            order_id = None
            for field in custom_fields:
                if field.get('variable_name') == 'order_id':
                    order_id = field.get('value')
                    break

            if not order_id:
                return JsonResponse({'error': 'Missing order_id in metadata'}, status=400)

            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                return JsonResponse({'error': 'Order not found'}, status=404)

            # Save or update Payment
            payment, created = Payment.objects.get_or_create(
                mpesa_code=pay_data['reference'],  # we use this as unique reference
                defaults={
                    'order': order,
                    'amount': float(pay_data['amount']) / 100,
                    'status': 'completed',
                    'gateway_response': json.dumps(pay_data),
                    'paid_at': parse_datetime(pay_data.get('paid_at')),
                }
            )

            # Optionally update order status
            order.status = 'paid'
            order.save()

            return JsonResponse({'message': 'Payment verified and saved successfully'})

        return JsonResponse({'error': 'Payment not successful'}, status=400)

    except Exception as e:
        return JsonResponse({'error': 'Server error', 'details': str(e)}, status=500)




@csrf_exempt
def paystack_webhook(request):
    paystack_secret_key = os.getenv("PAYSTACK_SECRET_KEY")
    paystack_signature = request.headers.get('x-paystack-signature')

    computed_signature = hmac.new(
        bytes(paystack_secret_key, 'utf-8'),
        msg=request.body,
        digestmod=hashlib.sha512
    ).hexdigest()

    if computed_signature != paystack_signature:
        return JsonResponse({'status': 'unauthorized'}, status=401)

   


def handle_successful_payment(order):
    commission_rate = 0.10  # 10%

    items_by_vendor = {}

    # Step 1: Group OrderItems by Vendor
    for item in order.items.all():
        vendor = item.product.vendor
        items_by_vendor.setdefault(vendor, []).append(item)

    # Step 2: Loop through each vendor's items
    for vendor, items in items_by_vendor.items():
        vendor_total = sum(item.price * item.quantity for item in items)
        commission = vendor_total * commission_rate
        payout_amount = vendor_total - commission

        # Step 3: Save payout record
        payout = VendorPayout.objects.create(
            vendor=vendor,
            amount_sent=payout_amount,
            commission_taken=commission,
            order_item=items[0]  # or loop + relate each
        )

        # Step 4: Send payout via Paystack
        send_payout_to_vendor(vendor, payout_amount, order.reference)



def send_payout_to_vendor(vendor, amount, reference):
    url = "https://api.paystack.co/transfer"
    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "source": "balance",
        "amount": int(amount * 100),  # convert to kobo/cents
        "recipient": vendor.recipient_code,
        "reason": f"Payout for order {reference}"
    }

    response = requests.post(url, headers=headers, json=data)
    if response.ok:
        # Optionally update payout.status = 'completed'
        return response.json()
    else:
        # Optionally log error + retry later
        return {"error": "Transfer failed", "details": response.text}




class VendorPayoutListView(generics.ListAPIView):
    queryset = VendorPayout.objects.all().select_related('vendor', 'order_item')
    serializer_class = VendorPayoutSerializer
    permission_classes = [permissions.IsAdminUser]