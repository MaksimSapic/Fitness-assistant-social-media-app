import Calculator from "../../Components/Calculator/Calculator";
import CalorieBurn from "../../Components/ChartCard/CalorieBurn/CalorieBurn";
import PieChartCard from "../../Components/ChartCard/PieChartCard/PieChartCard";
import SurfaceChart from "../../Components/ChartCard/SurfaceChart/SurfaceChart";
import "./Home.css";
import { useWorkoutStats, WorkoutStats } from "../../Hooks/useWorkoutStats";
import { useEffect } from "react";

function Home() {
  const userString = localStorage.getItem("user");
  const tokensString = localStorage.getItem("tokens");
  
  useEffect(() => {
    if (!userString || !tokensString) {
      console.error("Missing user data or tokens");
      window.location.href = '/login';
      return;
    }
    
    const userdata = JSON.parse(userString);
    console.log("User ID:", userdata.id);
    console.log("Tokens present:", !!tokensString);
  }, [userString, tokensString]);

  const userdata = userString ? JSON.parse(userString) : null;
  const { stats, loading, error } = useWorkoutStats(userdata?.id);

  // Provide empty arrays as fallbacks when data is undefined
  const defaultData = {
    calorie_burn: [],
    workout_counts: [],
    duration_water: []
  };

  const chartData = stats?.chart_data || defaultData;

  return (
    <>
      <div className="wrapper">
        <div className="container">
          <div className="calculator">
            <Calculator></Calculator>
          </div>
          <div className="stats">
            <CalorieBurn Cdata={chartData.calorie_burn}></CalorieBurn>
            <PieChartCard Pdata={chartData.workout_counts}></PieChartCard>
            <SurfaceChart Sdata={chartData.duration_water}></SurfaceChart>
          </div>
          <div className="clear"></div>
        </div>
      </div>
    </>
  );
}

export default Home;
