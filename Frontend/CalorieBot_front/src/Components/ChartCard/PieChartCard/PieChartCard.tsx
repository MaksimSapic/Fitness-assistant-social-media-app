import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTheme } from "../../../Theme/Theme";
import Colors from "../chart_colors";
import "./PieChartCard.css";

interface PieChartProps {
  Pdata: {
    workout_type: string;
    count: number;
  }[];
}

function PieChartCard({ Pdata }: PieChartProps) {
  const { theme } = useTheme();
  return (
    <>
      <div
        style={{
          backgroundColor: theme.element,
        }}
        className="screen-element chart-mini"
      >
        <h3
          style={{
            color: theme.text_plain,
          }}
        >
          Types of workout
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
              <PieChart
                style={{
                  backgroundColor: theme.background,
                  borderRadius: 15,
                  transition: "0.5s ease-in",
                }}
              >
                <Pie
                  data={Pdata}
                  dataKey="count"
                  nameKey="workout_type"
                  cx="50%"
                  cy="50%"
                  outerRadius="45%"
                  fill="#8884d8"
                >
                  {Pdata?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={Colors[index % Colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  wrapperStyle={{
                    fontSize: 'calc(0.6rem + 0.3vw)',
                    paddingTop: 'calc(5px + 0.5vh)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
export default PieChartCard;
