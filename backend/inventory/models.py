from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('PRODUCE', 'Produce'),
        ('MEAT', 'Meat'),
        ('DRY_GOODS', 'Dry Goods'),
        ('CLEANING', 'Cleaning'),
        ('BAR', 'Bar Supplies'),
        ('OTHER', 'Other'),
    ]

    SUPPLIER_CHOICES = [
        ('FISH_COMPANY', 'Fish Company'),
        ('COSTCO', 'Costco'),
        ('RESTAURANT_DEPOT', 'Restaurant Depot'),
        ('LOCAL_SUPPLIER', 'Local Supplier'),
        ('OTHER', 'Other'),
    ]

    LOCATION_CHOICES = [
        ('BABYTUNA_SUSHI', 'BabyTuna Sushi'),
        ('BABYTUNA_POKI_PHO', 'BabyTuna Poki & Pho'),
        ('DOWNTOWN', 'Downtown'),
        ('UPTOWN', 'Uptown'),
        ('MIDTOWN', 'Midtown'),
        ('GENERAL', 'General'),
    ]

    name = models.CharField(max_length=100)
    current_stock = models.IntegerField(default=0)
    min_stock_threshold = models.IntegerField(default=10)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='OTHER')
    supplier = models.CharField(max_length=50, choices=SUPPLIER_CHOICES, default='OTHER')
    location = models.CharField(max_length=50, choices=LOCATION_CHOICES, default='GENERAL')
    restock_interval_days = models.PositiveIntegerField(default=7)
    last_ordered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def days_since_last_order(self):
        if not self.last_ordered_at:
            return None
        delta = timezone.now() - self.last_ordered_at
        return delta.days


class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    URGENCY_CHOICES = [
        ('Normal', 'Normal'),
        ('Rush', 'Rush'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='orders')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(default=1)
    source = models.CharField(max_length=50, choices=Product.SUPPLIER_CHOICES, default='OTHER')
    location = models.CharField(max_length=50, choices=Product.LOCATION_CHOICES, default='GENERAL')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='Normal')
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order for {self.quantity} x {self.product.name}"
