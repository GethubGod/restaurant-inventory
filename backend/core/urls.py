from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from inventory.views import ProductViewSet, OrderViewSet
from django.conf import settings
from django.conf.urls.static import static

# --- NEW IMPORTS ---
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # --- NEW AUTH ENDPOINTS ---
    # Login URL: Send JSON {username, password} -> Get JSON {access, refresh}
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Refresh URL: Send {refresh} -> Get new {access}
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)