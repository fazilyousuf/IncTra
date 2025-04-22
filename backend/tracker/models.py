from django.db import models

# Create your models here.
from django.conf import settings
from django.db import models

class Account(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
    bank = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def _str_(self):
        return self.user

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def _str_(self):
        return self.name

class Transaction(models.Model):
    INCOME = 'IN'
    EXPENSE = 'EX'
    TRANSACTION_TYPE_CHOICES = [
        (INCOME, 'Income'),
        (EXPENSE, 'Expense'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Add this
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)
    transaction_type = models.CharField(max_length=2, choices=TRANSACTION_TYPE_CHOICES)

    # Keep existing methods (save/delete logic)
from django.contrib.auth.models import User
CATEGORY_CHOICES = [
    ('Food', 'Food'),
    ('Entertainment', 'Entertainment'),
    ('Transportation', 'Transportation'),
    ('Health', 'Health'),
    ('Shopping', 'Shopping'),
    ('Home', 'Home'),
    ('Others', 'Others'),
]

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    allocated_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'category')

