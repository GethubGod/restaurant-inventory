from django.shortcuts import render
from rest_framework import viewsets
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer
from django.core.mail import send_mail

class ProductViewSet(viewsets.ModelViewSet):
    #Quaryset = the raw data we want to look at
    queryset = Product.objects.all()
    #serializer = the translator
    serializer_class = ProductSerializer

class OrderViewSet(viewsets.ModelViewSet):
    #automatically handles get and post
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        #automatically attach user to request
        serializer.save(user=self.request.user)

        send_mail(
            subject=f"New Order: {order.product.name}",
            message=f"Someone just ordered {order.quantity} units of {order.product.name}.",
            from_email="system@restaurant.com",
            recipient_list=["manager@restaurant.com"],
            fail_silently=True,
        )



