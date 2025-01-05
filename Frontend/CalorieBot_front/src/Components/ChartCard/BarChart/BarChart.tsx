import { useTheme } from "../../../Theme/Theme";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: {
    month: string;
    average_calories: number;
    total_calories: number;
    workouts: number;
  }[];
}

function BChart({ data }: BarChartProps) {
  const { theme } = useTheme();

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          style={{
            backgroundColor: theme.background,
            borderRadius: 15,
            transition: "0.5s ease-in",
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            style={{ fill: theme.text }}
          />
          <YAxis 
            yAxisId="left"
            style={{ fill: theme.text }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            style={{ fill: theme.text }}
          />
          <Tooltip />
          <Legend />
          <Bar 
            yAxisId="left"
            dataKey="average_calories" 
            fill="#8884d8" 
            name="Avg. Calories/Workout"
          />
          <Bar 
            yAxisId="left"
            dataKey="total_calories" 
            fill="#82ca9d" 
            name="Total Calories"
          />
          <Bar 
            yAxisId="right"
            dataKey="workouts" 
            fill="#ffc658" 
            name="Number of Workouts"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BChart;
