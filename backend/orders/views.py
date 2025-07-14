from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, Coupon
from .serializers import CartSerializer, OrderSerializer, OrderStatusSerializer, CouponSerializer
from products.models import Product
from rest_framework import generics

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
    # authentication_classes = [TokenAuthentication, SessionAuthentication, BasicAuthentication]
    authentication_classes = [SessionAuthentication]
    permission_classes = [AllowAny]  # Allow any user to access the cart

    def get(self, request):
        print("===== GET /api/cart/ START =====")

        session_key = request.session.session_key
        if not session_key:
            print("[DEBUG] No session key found. Creating new session...")
            request.session.create()
            session_key = request.session.session_key
        else:
            print(f"[DEBUG] Existing session key: {session_key}")
        
        request.session.modified = True  # Ensure session is saved

        session_cart = Cart.objects.filter(session_key=session_key, user=None).first()
        print(f"[DEBUG] Found session-based cart: {session_cart.id if session_cart else 'None'}")

        if request.user.is_authenticated:
            print(f"[DEBUG] Authenticated user: {request.user.email}")
            user_cart, created = Cart.objects.get_or_create(user=request.user)
            print(f"[DEBUG] User cart ID: {user_cart.id} | Created: {created}")

            # Merge anonymous cart into user cart
            if session_cart and session_cart != user_cart:
                print(f"[DEBUG] Merging session cart ({session_cart.id}) into user cart ({user_cart.id})")
                for item in session_cart.items.all():
                    user_item, created = CartItem.objects.get_or_create(cart=user_cart, product=item.product)
                    if created:
                        user_item.quantity = item.quantity
                    else:
                        user_item.quantity += item.quantity
                    user_item.save()
                    print(f"[DEBUG] Merged item: {item.product.name} | Quantity: {user_item.quantity}")
                session_cart.delete()
                print(f"[DEBUG] Deleted session cart: {session_cart.id}")

            cart = user_cart
            if cart.session_key:
                print(f"[DEBUG] Clearing session_key from user cart (was: {cart.session_key})")
                cart.session_key = None
                cart.save()
        else:
            # Anonymous user — use session-based cart
            print("[DEBUG] Anonymous user")
            cart, created = Cart.objects.get_or_create(session_key=session_key, user=None)
            print(f"[DEBUG] Anonymous cart ID: {cart.id} | Created: {created}")

        serializer = CartSerializer(cart)
        print(f"[DEBUG] Returning cart with {len(serializer.data['items'])} items")
        print("===== GET /api/cart/ END =====\n")

        return Response({'cart': serializer.data})

    def post(self, request):
        print("===== POST /api/cart/ START =====")

        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        print(f"[DEBUG] Product ID: {product_id}, Quantity: {quantity}")

        product = get_object_or_404(Product, id=product_id)
        print(f"[DEBUG] Product retrieved: {product.name}")

        session_key = request.session.session_key
        if not session_key:
            print("[DEBUG] No session key found, creating one...")
            request.session.create()
            session_key = request.session.session_key
        print(f"[DEBUG] Session key: {session_key}")
        request.session.modified = True  # Ensure session is marked as modified

        # CART CREATION LOGIC
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
            print(f"[DEBUG] Authenticated user: {request.user.email} | Cart ID: {cart.id} | Created: {created}")
            if cart.session_key:
                print(f"[DEBUG] Clearing cart session_key from {cart.session_key}")
                cart.session_key = None
                cart.save()
        else:
            cart, created = Cart.objects.get_or_create(session_key=session_key, user=None)
            print(f"[DEBUG] Anonymous user cart | Cart ID: {cart.id} | Created: {created}")

        # CART ITEM LOGIC
        cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)
        if item_created:
            print(f"[DEBUG] New CartItem created for Product ID: {product.id}")
            cart_item.quantity = quantity
        else:
            print(f"[DEBUG] CartItem already exists (old quantity: {cart_item.quantity})")
            cart_item.quantity += quantity
        cart_item.save()
        print(f"[DEBUG] CartItem final quantity: {cart_item.quantity}")

        serializer = CartSerializer(cart)
        print(f"[DEBUG] Cart serialized with {len(serializer.data['items'])} items")
        print("===== POST /api/cart/ END =====\n")

        return Response({
            'cart': serializer.data,
            'added_product': {
                'id': product.id,
                'name': product.name,
                'quantity': cart_item.quantity
            }
        })

    def delete(self, request):
        print("===== DELETE /api/cart/ START =====")

        product_id = request.data.get('product_id') or request.query_params.get('product_id')
        if not product_id:
            print("[DEBUG] No product_id provided in DELETE request")
            return Response({'error': 'product_id is required'}, status=400)

        product = get_object_or_404(Product, id=product_id)
        print(f"[DEBUG] Product to remove: {product.name}")

        session_key = request.session.session_key
        if not session_key:
            print("[DEBUG] No session key found, creating one...")
            request.session.create()
            session_key = request.session.session_key
        print(f"[DEBUG] Session key: {session_key}")
        request.session.modified = True

        if request.user.is_authenticated:
            cart = Cart.objects.filter(user=request.user).first()
            print(f"[DEBUG] Authenticated user cart: {cart.id if cart else 'None'}")
        else:
            cart = Cart.objects.filter(session_key=session_key, user=None).first()
            print(f"[DEBUG] Anonymous user cart: {cart.id if cart else 'None'}")

        if not cart:
            print("[DEBUG] No cart found for user/session")
            return Response({'error': 'Cart not found'}, status=404)

        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        if not cart_item:
            print("[DEBUG] CartItem not found for product in cart")
            return Response({'error': 'Cart item not found'}, status=404)

        cart_item.delete()
        print(f"[DEBUG] Deleted CartItem for product: {product.name}")

        serializer = CartSerializer(cart)
        print(f"[DEBUG] Returning updated cart with {len(serializer.data['items'])} items")
        print("===== DELETE /api/cart/ END =====\n")

        return Response({'cart': serializer.data})

class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

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
