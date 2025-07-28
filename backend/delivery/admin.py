from django.contrib import admin
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
from django.contrib import messages
from .models import DeliveryApplication

@admin.register(DeliveryApplication)
class DeliveryApplicationAdmin(admin.ModelAdmin):
    list_display = ['user', 'status', 'created_at', 'updated_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    actions = ['approve_selected_applications']
    
    def approve_selected_applications(self, request, queryset):
        """Custom admin action to approve applications without password prompt"""
        approved_count = 0
        
        for application in queryset.filter(status='pending'):
            # Update status
            application.status = 'approved'
            application.save()
            
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
            
            approved_count += 1
        
        if approved_count > 0:
            messages.success(request, f'Successfully approved {approved_count} delivery applications and sent welcome emails.')
        else:
            messages.warning(request, 'No pending applications were selected for approval.')
    
    approve_selected_applications.short_description = "Approve selected delivery applications"
    
    def save_model(self, request, obj, form, change):
        old_status = None
        if change:
            old_status = DeliveryApplication.objects.get(pk=obj.pk).status
        
        super().save_model(request, obj, form, change)
        
        # Check if status changed to approved
        if change and old_status != 'approved' and obj.status == 'approved':
            self.send_approval_email(obj)
    
    def send_approval_email(self, application):
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
