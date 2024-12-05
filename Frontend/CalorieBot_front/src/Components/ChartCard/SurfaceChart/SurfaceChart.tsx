import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
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
        className="screen-element chart-mini"
        style={{
          backgroundColor: theme.element,
        }}
      >
        <h3
          style={{
            color: theme.text_plain,
          }}
        >
          Duration to water intake
        </h3>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "calc(200px + 15vh)",
            minHeight: "250px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
            }}
          >
            <ResponsiveContainer>
              <AreaChart
                data={data}
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
                <Legend 
                  wrapperStyle={{
                    fontSize: 'calc(0.6rem + 0.3vw)',
                    paddingTop: 'calc(5px + 0.5vh)'
                  }}
                />
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
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
export default SurfaceChart;
