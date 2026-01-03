from django.db import models
from django.contrib.auth.models import User # Import the User table

# Create your models here.
class Product(models.Model):
    #CharField = Character Field (text). we limit it to 100 letters.
    name = models.CharField(max_length=100)

    #IntegerField = whole numbers. No decimals.
    current_stock = models.IntegerField(default=0)

    #if stock drops below this number, send alert
    min_stock_threshold = models.IntegerField(default=10)

    #upload_to tells Django to put files inside media/products/
    #null=True, blank = true menas it is ok if product doesnt have image yet
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    #makes item look nice in admin panel
    def __str__(self):
        return self.name

class Order(models.Model):
    #the link connects thsi order to a specific product ID
    #on_delete=models.CASCADE means if you delete "napkins" delete all napkin order too

    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    quantity = models.IntegerField(default=1)

    #auto_now_add=True menas it automatically sets teh time to now when created
    created_at = models.DateTimeField(auto_now_add=True)

    #status to track the lifecycle
    status = models.CharField(max_length=20, default='pending')

    def __str__(self):
        return f"Order for {self.quantity} x {self.product.name}"
    
class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True) 
    quantity = models.IntegerField(default=1)