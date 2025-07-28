from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from orders.models import Order
from products.models import Product
from django.db.models import Sum, Count, F
from django.utils.timezone import now, timedelta

class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Filter orders for the vendor
        vendor_orders = Order.objects.filter(items__product__vendor=user).distinct()

        # Total sales amount
        total_sales = vendor_orders.aggregate(total=Sum('total_price'))['total'] or 0

        # Total orders count
        total_orders = vendor_orders.count()

        # Sales trend: total sales per day for last 7 days
        today = now().date()
        last_week = today - timedelta(days=7)
        sales_trend_qs = vendor_orders.filter(created_at__date__gte=last_week).values('created_at__date').annotate(
            daily_sales=Sum('total_price')
        ).order_by('created_at__date')

        # Defensive check: ensure vendor_orders is not empty and has related items
        if not vendor_orders.exists():
            return Response({
                'total_sales': 0,
                'total_orders': 0,
                'sales_trend': [],
                'top_products': [],
            })

        sales_trend = []
        for i in range(8):
            day = last_week + timedelta(days=i)
            day_sales = next((item['daily_sales'] for item in sales_trend_qs if item['created_at__date'] == day), 0)
            sales_trend.append({'date': day.isoformat(), 'sales': day_sales})

        top_products = [{'product_name': p['product_name'], 'total_sold': p['total_sold']} for p in top_products_qs]

        data = {
            'total_sales': total_sales,
            'total_orders': total_orders,
            'sales_trend': sales_trend,
            'top_products': top_products,
        }

        return Response(data)
