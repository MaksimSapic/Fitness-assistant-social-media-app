from django.db import models
import hashlib
import os
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    hash = models.CharField(max_length=128)  # For SHA-512 hash
    salt = models.CharField(max_length=32)   # For 16-byte salt
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # New fields
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    ]
    
    weight = models.FloatField(validators=[MinValueValidator(20.0), MaxValueValidator(300.0)])
    height = models.FloatField(validators=[MinValueValidator(0.5), MaxValueValidator(3.0)])
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    age = models.IntegerField(validators=[MinValueValidator(13), MaxValueValidator(120)])
    fat_percentage = models.FloatField(validators=[MinValueValidator(2.0), MaxValueValidator(70.0)])
    workout_frequency = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    bmi = models.FloatField(editable=False)  # This will be calculated
    experience_level = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username

    def set_password(self, password):
        """
        Set the password for the user by generating a new salt and hash
        """
        # Generate a random 16-byte salt
        self.salt = os.urandom(16).hex()
        # Create the hash using the password and salt
        self.hash = self._hash_password(password, self.salt)

    def check_password(self, password):
        """
        Verify if the provided password matches the stored hash
        """
        calculated_hash = self._hash_password(password, self.salt)
        return calculated_hash == self.hash

    @staticmethod
    def _hash_password(password, salt):
        """
        Create a SHA-512 hash of the password using the provided salt
        """
        # Combine password and salt
        salted = password.encode() + bytes.fromhex(salt)
        # Create hash using SHA-512
        return hashlib.sha512(salted).hexdigest()