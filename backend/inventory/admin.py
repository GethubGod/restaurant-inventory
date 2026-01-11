from django.contrib import admin
from .models import Product, Order


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "supplier", "category", "location", "current_stock", "min_stock_threshold", "restock_interval_days", "last_ordered_at")
    list_filter = ("supplier", "category", "location")
    search_fields = ("name",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("product", "quantity", "source", "location", "status", "urgency", "created_at")
    list_filter = ("status", "urgency", "source", "location")
    search_fields = ("product__name", "user__username")
