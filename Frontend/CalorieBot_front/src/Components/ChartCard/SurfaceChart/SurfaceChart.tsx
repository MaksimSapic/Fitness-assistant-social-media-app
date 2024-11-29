import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./SurfaceChart.css";
import data from "./MockData";
import { useTheme } from "../../../Theme/Theme";
function SurfaceChart() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <div
        className="screen-element chart"
        style={{
          backgroundColor: theme.element,
        }}
      >
        <h3
          style={{
            color: theme.text_plain,
          }}
        >
          Session length to water intake
        </h3>
        <AreaChart
          data={data}
          width={300}
          height={300}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          style={{
            backgroundColor: theme.background,
            borderRadius: 15,
            transition: "0.5s ease-in",
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey="pv"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </div>
    </>
  );
}
export default SurfaceChart;
