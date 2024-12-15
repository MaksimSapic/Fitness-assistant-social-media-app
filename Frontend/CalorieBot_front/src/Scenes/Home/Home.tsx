import Calculator from "../../Components/Calculator/Calculator";
import CalorieBurn from "../../Components/ChartCard/CalorieBurn/CalorieBurn";
import PieChartCard from "../../Components/ChartCard/PieChartCard/PieChartCard";
import SurfaceChart from "../../Components/ChartCard/SurfaceChart/SurfaceChart";
import "./Home.css";
import { useWorkoutStats, WorkoutStats } from "../../Hooks/useWorkoutStats";

function Home() {
  const user: any = localStorage.getItem("user");
  const userdata: any = user ? JSON.parse(user) : null;
  const data = useWorkoutStats(userdata.id);

  // Provide empty arrays as fallbacks when data is undefined
  const defaultData = {
    calorie_burn: [],
    workout_counts: [],
    duration_water: []
  };

  const chartData = data.stats?.chart_data || defaultData;

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
