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

interface CalorieBurnProps {
  Cdata: {
    date: string;
    calories_burned: number;
  }[];
}

function ChartCard({ Cdata }: CalorieBurnProps) {
  const { theme } = useTheme();
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
                data={Cdata}
                style={{
                  backgroundColor: theme.background,
                  borderRadius: 15,
                  transition: "0.5s ease-in",
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calories_burned" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChartCard;
