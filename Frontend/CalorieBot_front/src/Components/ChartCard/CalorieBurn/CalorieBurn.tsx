import { useTheme } from "../../../Theme/Theme";
import "./CalorieBurn.css";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
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
              <LineChart
                data={MockData}
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
                <Line type="monotone" dataKey="pv" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChardCard;
