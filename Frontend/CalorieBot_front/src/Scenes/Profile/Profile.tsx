import BChart from "../../Components/ChartCard/BarChart/BarChart";
import UserPosts from "../../Components/Posts/UserPosts";
import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import { user } from "../../Models/user";
import { useTheme } from "../../Theme/Theme";
import { useWorkoutStats } from "../../Hooks/useWorkoutStats";
import "./Profile.css";
import CreatePost from "../../Components/CreatePost/CreatePost";

function Profile() {
  const { theme } = useTheme();
  const data = localStorage.getItem("user");
  const userdata: user = data ? JSON.parse(data) : null;
  const { stats, loading, error } = useWorkoutStats(userdata?.id);

  // Calculate monthly averages for the bar chart
  const getMonthlyStats = () => {
    if (!stats?.chart_data?.calorie_burn) return [];

    const monthlyData = stats.chart_data.calorie_burn.reduce(
      (acc: any, curr) => {
        const month = curr.date.substring(0, 7); // Get YYYY-MM
        if (!acc[month]) {
          acc[month] = {
            calories: 0,
            count: 0,
          };
        }
        acc[month].calories += curr.calories_burned;
        acc[month].count += 1;
        return acc;
      },
      {}
    );

    return Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
      month,
      average_calories: Math.round(data.calories / data.count),
      total_calories: Math.round(data.calories),
      workouts: data.count,
    }));
  };

  const monthlyStats = getMonthlyStats();

  return (
    <div className="wrap">
      <div
        className="screen-element profile"
        style={{ backgroundColor: theme.element, color: theme.text_plain }}
      >
        <ProfileCard user={userdata} />
      </div>
      <div className="posts-insights">
        <div
          className="screen-element your-posts"
          style={{ backgroundColor: theme.element }}
        >
          <h2 style={{ color: theme.text_plain }}>Your posts</h2>
          <UserPosts />
          <CreatePost />
        </div>
        <div
          className="screen-element insights"
          style={{ backgroundColor: theme.element }}
        >
          <h2 style={{ color: theme.text_plain }}>Monthly Statistics</h2>
          {loading ? (
            <p style={{ color: theme.text_plain }}>Loading stats...</p>
          ) : error ? (
            <p style={{ color: theme.text_plain }}>Error loading stats</p>
          ) : (
            <BChart data={monthlyStats} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
