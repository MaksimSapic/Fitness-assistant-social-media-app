import { useTheme } from "../../../Theme/Theme";
import "./CalorieBurn.css";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MockData from "./MockData";
function ChardCard() {
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
          History of calorie burn
        </h3>
        <LineChart
          width={630}
          height={300}
          data={MockData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          style={{
            backgroundColor: theme.background,
            borderRadius: 15,
            transition: "0.5s ease-in",
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {/* <Legend /> */}
          <Line type="monotone" dataKey="pv" stroke="#8884d8" />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
      </div>
    </>
  );
}

export default ChardCard;
