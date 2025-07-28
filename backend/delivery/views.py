"""
Complete implementation of delivery views logic
This file contains the detailed logic for all delivery views
"""
from decimal import Decimal
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Sum, Count, Avg, Q

from django.utils import timezone
from datetime import datetime, timedelta
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, UpdateAPIView, CreateAPIView
from .models import (
    Delivery, 
    DeliverySchedule, 
    DeliveryApplication, 
    DeliveryPersonProfile, 
    EarningsTransaction,
    OrderAssignment
)

from .serializers import (
    DeliverySerializer, 
    DeliveryScheduleSerializer, 
    DeliveryApplicationSerializer,
    DeliveryPersonProfileSerializer,
    EarningsTransactionSerializer,
    DeliveryEarningSerializer,
    DeliveryHistorySerializer,
    DeliveryFeeSerializer
)
from orders.models import Order
from users.models import User
import logging
from rest_framework.decorators import api_view, permission_classes
import openrouteservice
from django.conf import settings
import requests






logger = logging.getLogger(__name__)

class DeliveryListView(ListCreateAPIView):
    """
    List all deliveries or create a new delivery
    """
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'delivery':
            return Delivery.objects.filter(delivery_person=user)
        elif user.user_type == 'customer':
            return Delivery.objects.filter(order__customer=user)
        elif user.user_type == 'vendor':
            return Delivery.objects.filter(order__items__product__vendor=user).distinct()
        return Delivery.objects.none()

    def perform_create(self, serializer):
        # Only staff or system can create deliveries
        if self.request.user.user_type not in ['admin', 'staff']:
            raise PermissionError("Only staff can create deliveries")
        serializer.save()

class DeliveryAssignView(APIView):
    """
    Assign a delivery to a delivery person
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            order_id = request.data.get('order_id')
            delivery_person_id = request.data.get('delivery_person_id')
            
            order = get_object_or_404(Order, id=order_id)
            delivery_person = get_object_or_404(User, id=delivery_person_id, user_type='delivery')
            
            # Check if delivery already exists for this order
            if Delivery.objects.filter(order=order).exists():
                return Response(
                    {'error': 'Delivery already exists for this order'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create delivery
            delivery = Delivery.objects.create(
                order=order,
                delivery_person=delivery_person,
                status='pending',
                delivery_fee=50.00  # Default fee, can be calculated
            )
            
            # Create earnings transaction
            EarningsTransaction.objects.create(
                delivery_person=delivery_person,
                transaction_type='delivery',
                amount=delivery.delivery_fee,
                status='pending',
                description=f'Delivery for order #{order.id}',
                delivery=delivery
            )
            
            return Response(
                {'message': 'Delivery assigned successfully', 'delivery_id': delivery.id},
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            logger.error(f"Error assigning delivery: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class DeliveryStatusView(UpdateAPIView):
    """
    Update delivery status
    """
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        delivery = serializer.instance
        
        # Check permissions
        if self.request.user != delivery.delivery_person and \
           self.request.user != delivery.order.customer and \
           self.request.user.user_type not in ['admin', 'staff']:
            raise PermissionError("You don't have permission to update this delivery")
        
        # Update delivered_at when status changes to delivered
        if serializer.validated_data.get('status') == 'delivered' and not delivery.delivered_at:
            serializer.validated_data['delivered_at'] = timezone.now()
            
            # Update earnings transaction
            earnings = EarningsTransaction.objects.filter(
                delivery=delivery,
                transaction_type='delivery'
            ).first()
            if earnings:
                earnings.status = 'completed'
                earnings.save()
                
                # Update delivery person's earnings
                profile = delivery.delivery_person.delivery_profile
                profile.total_earnings += earnings.amount
                profile.pending_earnings -= earnings.amount
                profile.available_balance += earnings.amount
                profile.total_deliveries += 1
                profile.save()
        
        serializer.save()

class DeliveryScheduleView(ListCreateAPIView):
    """
    List or create delivery schedules
    """
    serializer_class = DeliveryScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DeliverySchedule.objects.filter(delivery_person=self.request.user)

    def perform_create(self, serializer):
        serializer.save(delivery_person=self.request.user)

class DeliveryScheduleDetailView(RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a delivery schedule
    """
    queryset = DeliverySchedule.objects.all()
    serializer_class = DeliveryScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DeliverySchedule.objects.filter(delivery_person=self.request.user)

class DeliveryApplicationView(CreateAPIView):
    """
    Create a delivery application
    """
    queryset = DeliveryApplication.objects.all()
    serializer_class = DeliveryApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Check if user already has an application
        if DeliveryApplication.objects.filter(user=self.request.user).exists():
            raise ValueError("You already have a delivery application")
        
        serializer.save(user=self.request.user)

class DeliveryDashboardView(APIView):
    """
    Get delivery dashboard data
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        if user.user_type != 'delivery':
            return Response(
                {'error': 'Only delivery persons can access dashboard'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get delivery profile
        try:
            profile = user.delivery_profile
        except DeliveryPersonProfile.DoesNotExist:
            return Response(
                {'error': 'Delivery profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get today's deliveries
        today = timezone.now().date()
        today_deliveries = Delivery.objects.filter(
            delivery_person=user,
            assigned_at__date=today
        )
        
        # Get pending deliveries
        pending_deliveries = Delivery.objects.filter(
            delivery_person=user,
            status__in=['pending', 'picked_up', 'in_transit']
        )
        
        # Get completed deliveries this week
        week_start = today - timedelta(days=today.weekday())
        week_deliveries = Delivery.objects.filter(
            delivery_person=user,
            delivered_at__date__gte=week_start
        )
        
        # Get earnings summary
        total_earnings = EarningsTransaction.objects.filter(
            delivery_person=user,
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        dashboard_data = {
            'profile': DeliveryPersonProfileSerializer(profile).data,
            'today_deliveries': today_deliveries.count(),
            'pending_deliveries': pending_deliveries.count(),
            'week_deliveries': week_deliveries.count(),
            'total_earnings': float(total_earnings),
            'available_balance': float(profile.available_balance),
            'average_rating': float(profile.average_rating),
            'is_online': profile.is_online
        }
        
        return Response(dashboard_data, status=status.HTTP_200_OK)

class DeliveryStatusToggleView(APIView):
    """
    Toggle delivery person online/offline status
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            profile = request.user.delivery_profile
            profile.is_online = not profile.is_online
            profile.save()
            
            return Response({
                'message': f'Status updated to {"online" if profile.is_online else "offline"}',
                'is_online': profile.is_online
            }, status=status.HTTP_200_OK)
            
        except DeliveryPersonProfile.DoesNotExist:
            return Response(
                {'error': 'Delivery profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class AvailableDeliveriesView(ListAPIView):
    """
    List available deliveries for delivery persons
    """
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'delivery':
            return Delivery.objects.none()
            
        # Get deliveries that are pending and not assigned to anyone
        return Delivery.objects.filter(
            status='pending',
            delivery_person__isnull=True
        )

class AcceptDeliveryView(APIView):
    """
    Accept a delivery
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, delivery_id, *args, **kwargs):
        try:
            delivery = get_object_or_404(Delivery, id=delivery_id)
            
            if delivery.delivery_person:
                return Response(
                    {'error': 'Delivery already assigned'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if delivery.status != 'pending':
                return Response(
                    {'error': 'Delivery not available'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Assign delivery to current user
            delivery.delivery_person = request.user
            delivery.status = 'picked_up'
            delivery.save()
            
            # Update earnings transaction
            earnings = EarningsTransaction.objects.filter(
                delivery=delivery,
                transaction_type='delivery'
            ).first()
            if earnings:
                earnings.delivery_person = request.user
                earnings.save()
            
            return Response({
                'message': 'Delivery accepted successfully',
                'delivery_id': delivery.id
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class DeliveryEarningsView(ListAPIView):
    """
    Get delivery earnings
    """
    serializer_class = EarningsTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'delivery':
            return EarningsTransaction.objects.none()
            
        return EarningsTransaction.objects.filter(
            delivery_person=user
        ).order_by('-created_at')

class DeliveryHistoryView(ListAPIView):
    """
    Get delivery history
    """
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'delivery':
            return Delivery.objects.none()
            
        return Delivery.objects.filter(
            delivery_person=user,
            status='delivered'
        ).order_by('-delivered_at')

class EarningsTransactionView(ListAPIView):
    """
    Get earnings transactions
    """
    serializer_class = EarningsTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'delivery':
            return EarningsTransaction.objects.none()
            
        return EarningsTransaction.objects.filter(
            delivery_person=user
        ).order_by('-created_at')

class DeliverySettingsView(APIView):
    """
    Get or update delivery settings
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            profile = request.user.delivery_profile
            serializer = DeliveryPersonProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except DeliveryPersonProfile.DoesNotExist:
            return Response(
                {'error': 'Delivery profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, *args, **kwargs):
        try:
            profile = request.user.delivery_profile
            serializer = DeliveryPersonProfileSerializer(profile, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except DeliveryPersonProfile.DoesNotExist:
            return Response(
                {'error': 'Delivery profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class DeliveryProfileImageView(APIView):
    """
    Upload delivery profile image
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            profile = request.user.delivery_profile
            if 'profile_image' not in request.FILES:
                return Response(
                    {'error': 'No image provided'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            profile.profile_image = request.FILES['profile_image']
            profile.save()
            
            return Response({
                'message': 'Profile image uploaded successfully',
                'image_url': profile.profile_image.url if profile.profile_image else None
            }, status=status.HTTP_200_OK)
            
        except DeliveryPersonProfile.DoesNotExist:
            return Response(
                {'error': 'Delivery profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class AcceptOrderView(APIView):
    """
    Accept an order on a first-come, first-served basis.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id, *args, **kwargs):
        agent_id = request.query_params.get('agent_id')
        if not agent_id:
            return Response(
                {'error': 'Agent ID is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # Lock the order row for update to prevent race conditions
                order = Order.objects.select_for_update().get(id=order_id)

                if order.status == 'assigned':
                    return Response(
                        {'message': 'Order has already been taken.'},
                        status=status.HTTP_409_CONFLICT
                    )

                # Check if the agent is a valid delivery person
                delivery_person = get_object_or_404(User, id=agent_id, user_type='delivery')

                # Assign the order
                order.delivery_person = delivery_person
                order.status = 'assigned'
                order.save()

                # Update the OrderAssignment status if it exists
                assignment = OrderAssignment.objects.filter(order=order, delivery_person=delivery_person).first()
                if assignment:
                    assignment.status = 'accepted'
                    assignment.save()

                return Response(
                    {'message': 'Order assigned to you successfully!'},
                    status=status.HTTP_200_OK
                )

        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'Delivery agent not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error accepting order: {str(e)}")
            return Response(
                {'error': 'An unexpected error occurred.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class calculate_delivery_fee(APIView):
    def post(self, request):
        serializer = DeliveryFeeSerializer(data=request.data)
        if serializer.is_valid():
            lat = serializer.validated_data['lat']
            lng = serializer.validated_data['lng']
            cart_id = serializer.validated_data.get('cart_id') # Should be cart_id, will be updated later.

            # Shop coordinates (Kibabii University)
            shop_coords = [34.5683, 0.6085]  # [lon, lat]


            customer_coords = [lng, lat]  # [lon, lat]

            # Log request details
            logger.debug(f"Sending ORS request with coords: shop={shop_coords}, customer={customer_coords}")

            # Call OpenRouteService Directions API
            try:
                # Use the correct OpenRouteService endpoint with proper authentication
                ors_url = "https://api.openrouteservice.org/v2/directions/driving-car"
                headers = {
                    "Authorization": settings.ORS_API_KEY,
                    "Content-Type": "application/json",
                }
                payload = {
                    "coordinates": [shop_coords, customer_coords],
                    "units": "km",
                    "profile": "driving-car"
                }

                logger.info(f"Making ORS request to: {ors_url}")
                logger.debug(f"ORS request payload: {payload}")
                
                response = requests.post(ors_url, json=payload, headers=headers, timeout=30)
                
                if response.status_code == 404:
                    # Fallback to manual distance calculation if API fails
                    logger.warning("ORS API returned 404, using fallback distance calculation")
                    from math import radians, sin, cos, sqrt, atan2
                    
                    def haversine_distance(lat1, lon1, lat2, lon2):
                        R = 6371  # Earth's radius in kilometers
                        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
                        dlat = lat2 - lat1
                        dlon = lon2 - lon1
                        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
                        c = 2 * atan2(sqrt(a), sqrt(1-a))
                        return R * c
                    
                    distance = haversine_distance(0.6085, 34.5683, lat, lng)
                    logger.info(f"Fallback distance calculated: {distance} km")
                else:
                    response.raise_for_status()
                    data = response.json()
                    # ORS returns distance in meters, convert to km
                    distance = data['routes'][0]['summary']['distance'] / 1000.0
                    logger.debug(f"ORS response distance: {distance} km")


                # Calculate delivery fee: 20 KES base + 10 KES per km (rounded to nearest km)
                delivery_fee = Decimal('20.00') + (Decimal(str(round(distance))) * Decimal('10.00'))

                # The delivery fee is calculated and returned.
                # The delivery object will be associated with the order upon order creation.
                return Response({
                    "delivery_fee": delivery_fee.quantize(Decimal('0.01'))
                }, status=status.HTTP_200_OK)


            except requests.RequestException as e:
                logger.error(f"ORS API error: {str(e)}")
                return Response({
                    "error": f"Failed to calculate distance: {str(e)}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_delivery_coordinates(request):
    """
    Get coordinates from address using OpenRouteService geocoding
    """
    try:
        data = request.data
        address = data.get('address')

        if not address:
            logger.error("Address is required but not provided")
            return Response(
                {'error': 'Address is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Initialize OpenRouteService client
        client = openrouteservice.Client(key=settings.ORS_API_KEY)

        # Perform geocoding
        geocode_result = client.pelias_search(
            text=address,
            focus_point=[34.51, 0.61],  # Bias towards Kibabii Campus area (lng, lat)
            size=1  # Return only the top result
        )

        if not geocode_result['features']:
            logger.error(f"No coordinates found for address: {address}")
            return Response(
                {'error': 'Could not find coordinates for the provided address'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Extract coordinates from the top result
        coords = geocode_result['features'][0]['geometry']['coordinates']
        longitude, latitude = coords  # OpenRouteService returns [lng, lat]

        logger.debug(f"Geocoded address '{address}' to lat={latitude}, lng={longitude}")
        return Response({
            'lat': round(latitude, 6),
            'lng': round(longitude, 6),
            'address': address
        })

    except openrouteservice.exceptions.ApiError as e:
        logger.error(f"OpenRouteService geocoding error: {str(e)}")
        return Response(
            {'error': 'Failed to geocode address. Please try again.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Unexpected error in get_delivery_coordinates: {str(e)}")
        return Response(
            {'error': 'An unexpected error occurred'},
            status=status.HTTP_400_BAD_REQUEST
        )
