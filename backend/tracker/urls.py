from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'accounts', views.AccountViewSet, basename='account')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'transactions', views.TransactionViewSet, basename='transaction')

router.register(r'budgets', views.BudgetViewSet, basename='budget')

# Include JWT authentication URLs if needed (usually better to put in project urls)
urlpatterns = [
    path('', include(router.urls)),
]