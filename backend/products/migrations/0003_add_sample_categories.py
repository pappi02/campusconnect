from django.db import migrations

def add_sample_categories(apps, schema_editor):
    Category = apps.get_model('products', 'Category')
    product_categories = [
        "Foods and drinks",
        "Beauty and Cosmetics",
        "Baby Products",
        "Electronics",
        "Stationery",
        "Fresh Vegetables",
        "Fresh Fruits",
        "Cereals and Grains",
        "Traditional Vegetables",
        "Dairy and Poultry",
    ]
    service_categories = [
        "Beauty and Personal Care",
        "Home Services",
        "Repair Services",
        "Construction and Housing",
        "Transport Services",
    ]

    for name in product_categories:
        Category.objects.get_or_create(name=name, category_type='product')

    for name in service_categories:
        Category.objects.get_or_create(name=name, category_type='service')

class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),  # Adjusted to correct existing migration
    ]

    operations = [
        migrations.RunPython(add_sample_categories),
    ]
