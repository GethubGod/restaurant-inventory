from rest_framework import permissions, viewsets
from django.utils import timezone
from django.core.mail import send_mail

from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('name')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related('product').order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        order = serializer.save(user=user, status='Pending')

        # keep product freshness data in sync
        Product.objects.filter(id=order.product_id).update(last_ordered_at=timezone.now())

        try:
            send_mail(
                subject=f"New Order: {order.product.name}",
                message=f"{order.quantity} units of {order.product.name} ({order.urgency})",
                from_email="system@restaurant.com",
                recipient_list=["manager@restaurant.com"],
                fail_silently=True,
            )
        except Exception:
            # best-effort email; ignore in API flow
            pass


