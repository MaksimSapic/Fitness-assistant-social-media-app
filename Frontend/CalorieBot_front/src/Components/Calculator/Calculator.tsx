import { useTheme } from "../../Theme/Theme";
import "./Calculator.css";
function Calculator() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <div
        className="screen-element calculator"
        style={{
          backgroundColor: theme.element,
        }}
      >
        <h1>
          Tell me about your
          <br />
          last training session...
        </h1>
      </div>
    </>
  );
}

export default Calculator;
