from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import requests
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
import json



   



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

   