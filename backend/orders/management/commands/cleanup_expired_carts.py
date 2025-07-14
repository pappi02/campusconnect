from django.core.management.base import BaseCommand
from django.contrib.sessions.models import Session
from django.utils import timezone
from orders.models import Cart

class Command(BaseCommand):
    help = 'Delete anonymous carts linked to expired sessions'

    def handle(self, *args, **options):
        now = timezone.now()
        expired_sessions = Session.objects.filter(expire_date__lt=now)
        expired_session_keys = expired_sessions.values_list('session_key', flat=True)

        # Delete carts linked to expired sessions
        carts_deleted, _ = Cart.objects.filter(session_key__in=expired_session_keys, user=None).delete()

        self.stdout.write(self.style.SUCCESS(f'Deleted {carts_deleted} expired anonymous carts.'))
