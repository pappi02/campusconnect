@csrf_exempt
def paystack_webhook(request):
    event = json.loads(request.body)
    if event['event'] == 'charge.success':
        ref = event['data']['reference']
        # ✅ Update DB or log transaction
    return JsonResponse({'status': 'received'})
