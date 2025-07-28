from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, Coupon
from .serializers import CartSerializer, OrderSerializer, OrderStatusSerializer, CouponSerializer
from products.models import Product
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.authentication import JWTAuthentication
import json
import requests
import random
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from django.db.models import Sum
from django.contrib.auth import get_user_model

User = get_user_model()

class CouponCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CouponSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class CouponApplyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Coupon code is required'}, status=400)
        try:
            coupon = Coupon.objects.get(code=code, active=True)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid or inactive coupon code'}, status=404)

        discount = {}
        if coupon.amount:
            discount['amount'] = float(coupon.amount)
        if coupon.discount_percent:
            discount['discount_percent'] = float(coupon.discount_percent)

        return Response({'code': coupon.code, 'discount': discount})

class CartView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [AllowAny]  # Allow any user to access the cart

    def get(self, request):
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        
        request.session.modified = True  # Ensure session is saved

        session_cart = Cart.objects.filter(session_key=session_key, user=None).first()

        if request.user.is_authenticated:
            user_cart, created = Cart.objects.get_or_create(user=request.user)

            # Merge anonymous cart into user cart
            if session_cart and session_cart != user_cart:
                for item in session_cart.items.all():
                    user_item, created = CartItem.objects.get_or_create(cart=user_cart, product=item.product)
                    if created:
                        user_item.quantity = item.quantity
                    else:
                        user_item.quantity += item.quantity
                    user_item.save()
                session_cart.delete()

            cart = user_cart
            if cart.session_key:
                cart.session_key = None
                cart.save()
        else:
            # Anonymous user — use session-based cart
            cart, created = Cart.objects.get_or_create(session_key=session_key, user=None)

        serializer = CartSerializer(cart)
        return Response({'cart': serializer.data})

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        product = get_object_or_404(Product, id=product_id)

        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        request.session.modified = True  # Ensure session is marked as modified

        # CART CREATION LOGIC
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
            if cart.session_key:
                cart.session_key = None
                cart.save()
        else:
            cart, created = Cart.objects.get_or_create(session_key=session_key, user=None)

        # CART ITEM LOGIC
        cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)
        if item_created:
            cart_item.quantity = quantity
        else:
            cart_item.quantity += quantity
        cart_item.save()

        serializer = CartSerializer(cart)
        return Response({
            'cart': serializer.data,
            'added_product': {
                'id': product.id,
                'name': product.name,
                'quantity': cart_item.quantity
            }
        })

    def delete(self, request):
        product_id = request.data.get('product_id') or request.query_params.get('product_id')
        if not product_id:
            return Response({'error': 'product_id is required'}, status=400)

        product = get_object_or_404(Product, id=product_id)

        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        request.session.modified = True

        if request.user.is_authenticated:
            cart = Cart.objects.filter(user=request.user).first()
        else:
            cart = Cart.objects.filter(session_key=session_key, user=None).first()

        if not cart:
            return Response({'error': 'Cart not found'}, status=404)

        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        if not cart_item:
            return Response({'error': 'Cart item not found'}, status=404)

        cart_item.delete()

        serializer = CartSerializer(cart)
        return Response({'cart': serializer.data})

class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    authentication_classes = [JWTAuthentication]  # ✅ Use JWT for auth
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Generate a unique reference for the order
        reference = f'ref-{random.randint(100000, 999999999)}'
        serializer.save(customer=self.request.user, reference=reference, status='pending')

class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

class OrderStatusView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderStatusSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    try:
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            CartItem.objects.filter(cart=cart).delete()
        return Response({"message": "Cart cleared successfully."})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

from campus_delivery.analytics import AnalyticsView

class VendorDashboardView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        analytics_view = AnalyticsView()
        analytics_view.request = request
        analytics_view.format_kwarg = None
        analytics_view.format_suffix = None
        response = analytics_view.get(request)
        return response
