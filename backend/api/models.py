from django.db import models

class UserSignup(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(unique= True)
    password = models.CharField(max_length=50)
    
    def __str__(self):
        return self.email