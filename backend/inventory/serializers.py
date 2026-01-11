from rest_framework import serializers
from .models import Product, Order


class ProductSerializer(serializers.ModelSerializer):
    days_since_last_order = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_days_since_last_order(self, obj):
        return obj.days_since_last_order


class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_category = serializers.CharField(source='product.category', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

    def create(self, validated_data):
        product = validated_data.get('product')
        if validated_data.get('source') is None and product:
            validated_data['source'] = product.supplier
        if validated_data.get('location') is None and product:
            validated_data['location'] = product.location
        return super().create(validated_data)
