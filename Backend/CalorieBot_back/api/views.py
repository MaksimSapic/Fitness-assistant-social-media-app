import os
from django.conf import settings
from django.shortcuts import render
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User
from .serializers import UserSerializer
import pickle

# Create your views here.

model_path = os.path.join(settings.BASE_DIR, 'AI_model', 'model.pkl')
@api_view(['POST'])
def register_user(request):
    print("user wants to register")
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            serializer = UserSerializer(user)
            return Response(serializer.data)
        else:
            return Response({'error': 'Invalid credentials'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, 
                       status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def calculate_calories(request):
    try:
        # Učitaj podatke iz zahteva
        session_data = request.data.get('session', {})
        print(session_data)
        workout_data = {
            "Session_Duration": float(session_data['Session_Duration']),
            "Avg_BPM": int(session_data['Avg_BPM']),
            "Age": float(session_data['Age']),
            "Gender": session_data['Gender'],
            "Fat_Percentage": float(session_data['Fat_Percentage'])
        }

        print(workout_data)

        with open(model_path, 'rb') as f:
            model = pickle.load(f)
            print("pickle loaded")
            # Redosled kolona za model
            feature_order = [
                "Session_Duration", 
                "Avg_BPM",
                "Age",
                "Gender",
                "Fat_Percentage"
            ]

            final_data = pd.DataFrame([workout_data], columns=feature_order)

            print(final_data)

            calories_burned = model.predict(final_data)[0]
            
            return Response({
                'calories_burned': calories_burned
            }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)