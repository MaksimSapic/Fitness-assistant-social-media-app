import os
from django.conf import settings
from django.shortcuts import render
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import User, WorkoutSession
from .serializers import UserSerializer, WorkoutSessionSerializer
import pickle
from django.db.models import Sum, Avg
import math as m
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
model_path = os.path.join(settings.BASE_DIR, 'AI_model', 'model.pkl')

@api_view(['POST'])
def register_user(request):
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
            refresh = RefreshToken.for_user(user)
            serializer = UserSerializer(user)
            return Response({
                'user': serializer.data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            })
        else:
            return Response({'error': 'Invalid credentials'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, 
                       status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calculate_calories(request):
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        session_data = request.data.get('session', {})
        
        # Extract user ID from session data
        user = session_data.get('id')
        try:
            user = User.objects.get(id=user)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

        workout_data = {
            "Session_Duration": float(session_data['Session_Duration']),
            "Avg_BPM": int(session_data['Avg_BPM']),
            "Age": int(session_data['Age']),
            "Gender": session_data['Gender'],
            "Fat_Percentage": float(session_data['Fat_Percentage'])
        }

        feature_order = [
            "Session_Duration", 
            "Avg_BPM",
            "Age",
            "Gender",
            "Fat_Percentage"
        ]

        final_data = pd.DataFrame([workout_data], columns=feature_order)
        calories_burned = model.predict(final_data)[0]

        # Save workout session
        workout_session = WorkoutSession.objects.create(
            user=user,
            heart_avg=session_data['Avg_BPM'],
            heart_max=session_data['Max_BPM'],
            heart_rest=session_data['Rest_BPM'],
            workout_type=session_data['Workout_Type'],
            session_duration=session_data['Session_Duration'],
            water_intake=session_data['Water_Intake'],
            calories_burned=calories_burned
        )

        # Serialize the workout session
        serializer = WorkoutSessionSerializer(workout_session)
        
        return Response({
            'calories_burned': calories_burned
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_statistics(request, user_id):
    
    if not request.auth:
        return Response(
            {'error': 'No authentication token provided'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    try:
        user = User.objects.get(id=user_id)
        if request.user != user:
            return Response(
                {'error': 'Not authorized to view this user\'s statistics'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        workouts = WorkoutSession.objects.filter(user=user).order_by('-created_at')[:20]
        
        # Calculate summary statistics
        summary = {
            'total_workouts': workouts.count(),
            'total_calories': workouts.aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0,
            'avg_duration': workouts.aggregate(Avg('session_duration'))['session_duration__avg'] or 0,
            'avg_heart_rate': workouts.aggregate(Avg('heart_avg'))['heart_avg__avg'] or 0,
        }
        
        # Prepare chart data
        calorie_burn = [
            {
                'date': workout.created_at.strftime('%Y-%m-%d'),
                'calories_burned': round(workout.calories_burned,4)
            } for workout in workouts
        ]
        
        duration_water = [
            {
                'date': workout.created_at.strftime('%Y-%m-%d'),
                'duration': round(workout.session_duration,4),
                'water': round(workout.water_intake,4)
            } for workout in workouts
        ]
        
        # Count workout types
        workout_types = {}
        for workout in workouts:
            workout_types[workout.workout_type] = workout_types.get(workout.workout_type, 0) + 1
            
        workout_counts = [
            {'workout_type': wtype, 'count': count}
            for wtype, count in workout_types.items()
        ]
        
        response_data = {
            'summary': summary,
            'recent_workouts': WorkoutSessionSerializer(workouts, many=True).data,
            'chart_data': {
                'calorie_burn': calorie_burn,
                'duration_water': duration_water,
                'workout_counts': workout_counts
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)