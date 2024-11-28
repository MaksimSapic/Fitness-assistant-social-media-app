import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import data from "./MockData";
import { useTheme } from "../../../Theme/Theme";
import Colors from "../chart_colors";
import "./PieChartCard.css";
function PieChartCard() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <div
        style={{
          backgroundColor: theme.element,
        }}
        className="screen-element chart"
      >
        <h3
          style={{
            color: theme.text_plain,
          }}
        >
          Types of workout
        </h3>
        <PieChart
          width={300}
          height={300}
          margin={{ top: 9, right: 30, left: 20, bottom: 5 }}
          style={{
            backgroundColor: theme.background,
            borderRadius: 15,
          }}
        >
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={75}
            fill="#8884d8"
            // TODO find a way to make fill different colors
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={Colors[index % Colors.length]}
              ></Cell>
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </>
  );
}
export default PieChartCard;
