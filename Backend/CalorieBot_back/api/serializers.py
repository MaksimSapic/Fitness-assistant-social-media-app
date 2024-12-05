from rest_framework import serializers
from .models import User, WorkoutSession

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    bmi = serializers.FloatField(read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 
            'password', 'weight', 'height', 'gender', 'age', 
            'fat_percentage', 'workout_frequency', 'bmi', 
            'experience_level'
        )
        read_only_fields = ('id', 'bmi')

    def create(self, validated_data):
        password = validated_data.pop('password')
        weight = validated_data.get('weight')
        height = validated_data.get('height')
        bmi = weight / (height * height)
        
        user = User(**validated_data, bmi=bmi)
        user.set_password(password)
        user.save()
        return user

class WorkoutSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutSession
        fields = (
            'id', 'heart_avg', 'heart_max', 'heart_rest', 
            'workout_type', 'session_duration', 'water_intake', 
            'calories_burned', 'created_at'
        )
