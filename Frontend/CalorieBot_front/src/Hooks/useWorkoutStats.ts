import { useState, useEffect } from 'react';
import config from '../config';
import { authenticatedFetch } from '../utils/api';

export interface WorkoutSummary {
  total_workouts: number;
  total_calories: number;
  avg_duration: number;
  avg_heart_rate: number;
}

export interface WorkoutSession {
  id: number;
  heart_avg: number;
  heart_max: number;
  heart_rest: number;
  workout_type: string;
  session_duration: number;
  water_intake: number;
  calories_burned: number;
  created_at: string;
}

export interface WorkoutStats {
  summary: WorkoutSummary;
  recent_workouts: WorkoutSession[];
  chart_data: {
    calorie_burn: {
      date: string;
      calories_burned: number;
    }[];
    duration_water: {
      date: string;
      duration: number;
      water: number;
    }[];
    workout_counts: {
      workout_type: string;
      count: number;
    }[];
  };
}

export const useWorkoutStats = (userId: number) => {
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(`${config.url}api/user-statistics/${userId}/`);
      if (response && !response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      if (response) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [userId]);

  return { stats, loading, error, refreshStats: fetchStats };
};
