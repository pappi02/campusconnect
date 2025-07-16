from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import hashlib
import hmac
import os
from django.views.decorators.http import require_POST

def root_view(request):
    return JsonResponse({'message': 'Welcome to the Campus Delivery API'})


@ensure_csrf_cookie
@api_view(["GET"])
def get_csrf_token(request):
    return Response({"message": "CSRF cookie set"})



