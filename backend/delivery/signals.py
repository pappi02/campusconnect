from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
from .models import DeliveryApplication

@receiver(post_save, sender=DeliveryApplication)
def send_approval_email_on_status_change(sender, instance, created, **kwargs):
    """Send approval email when application status changes to approved"""
    if not created and instance.status == 'approved':
        # Check if this is actually a status change to approved
        try:
            old_instance = DeliveryApplication.objects.get(pk=instance.pk)
            if old_instance.status != 'approved':
                send_approval_email(instance)
        except DeliveryApplication.DoesNotExist:
            pass

def send_approval_email(application):
    """Send approval email with one-time password"""
    # Generate one-time password
    temp_password = get_random_string(8)
    
    # Set the password for the user
    application.user.set_password(temp_password)
    application.user.save()
    
    # Prepare email context
    context = {
        'user': application.user,
        'temp_password': temp_password,
        'login_url': 'http://localhost:5173/login',
        'support_email': 'support@campusconnect.com'
    }
    
    # Render email template
    html_message = render_to_string('emails/delivery_approval.html', context)
    plain_message = strip_tags(html_message)
    
    # Send email
    send_mail(
        subject='Welcome to CampusConnect Delivery Team!',
        message=plain_message,
        from_email='noreply@campusconnect.com',
        recipient_list=[application.user.email],
        html_message=html_message,
        fail_silently=False,
    )
