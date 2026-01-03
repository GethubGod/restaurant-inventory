from rest_framework import serializers
from .models import Product, Order

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        #translates every field into JSON
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    #source='product.name' is to go the linked product and grab its name
    #read_only=True: only use this when sening data not when receiving it
    product_name = serializers.CharField(source='product,name',read_only=True)
    class Meta:
        model = Order 
        fields = '__all__'