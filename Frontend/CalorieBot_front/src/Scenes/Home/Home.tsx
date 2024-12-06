import Calculator from "../../Components/Calculator/Calculator";
import CalorieBurn from "../../Components/ChartCard/CalorieBurn/CalorieBurn";
import PieChartCard from "../../Components/ChartCard/PieChartCard/PieChartCard";
import SurfaceChart from "../../Components/ChartCard/SurfaceChart/SurfaceChart";
import "./Home.css";
import { useWorkoutStats, WorkoutStats } from "../../Hooks/useWorkoutStats";
function Home() {
  const user:any = localStorage.getItem("user");
  const userdata:any = user?JSON.parse(user):null;
  const data = useWorkoutStats(userdata.id);
  console.log(data.stats)
  return (
    <>
      <div className="wrapper">
        <div className="container">
          <div className="calculator">
            <Calculator></Calculator>
          </div>
          <div className="stats">
            <CalorieBurn Cdata = {data.stats?.chart_data.calorie_burn}></CalorieBurn>
            <PieChartCard Pdata = {data.stats?.chart_data.workout_counts}></PieChartCard>
            <SurfaceChart Sdata = {data.stats?.chart_data.duration_water}></SurfaceChart>
          </div>
          <div className="clear"></div>
        </div>
      </div>
    </>
  );
}

export default Home;
