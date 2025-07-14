from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Product
from orders.models import Cart, CartItem

User = get_user_model()

class Command(BaseCommand):
    help = 'Test creating a cart and cart items for a user'

    def handle(self, *args, **options):
        # Get or create a test user
        user, created = User.objects.get_or_create(email='testuser@example.com', defaults={'password': 'testpass123'})
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created test user: {user.email}'))
        else:
            self.stdout.write(f'Using existing user: {user.email}')

        # Get a product to add to cart
        product = Product.objects.first()
        if not product:
            self.stdout.write(self.style.ERROR('No product found in database. Please add products first.'))
            return

        # Create or get cart for user
        cart, created = Cart.objects.get_or_create(user=user)
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created cart for user {user.email}'))
        else:
            self.stdout.write(f'Using existing cart for user {user.email}')

        # Create or get cart item
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if created:
            cart_item.quantity = 1
            cart_item.save()
            self.stdout.write(self.style.SUCCESS(f'Added product {product.name} to cart with quantity 1'))
        else:
            self.stdout.write(f'Product {product.name} already in cart with quantity {cart_item.quantity}')

        # Output current cart items
        self.stdout.write('Current cart items:')
        for item in cart.items.all():
            self.stdout.write(f'- {item.product.name}: {item.quantity}')
