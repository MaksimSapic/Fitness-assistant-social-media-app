import { useState } from "react";
import { useTheme } from "../../Theme/Theme";
import "./Calculator.css";
function Calculator() {
  const { theme, toggleTheme } = useTheme();
  const [results, showresults] = useState(false);
  var caloriesBurned = 123;
  return (
    <>
      <div className="container">
        <div
          className="screen-element"
          style={{
            backgroundColor: theme.element,
            border: "1px solid " + theme.border,
          }}
        >
          <div className="calculator-main">
            <h1
              style={{
                color: theme.text_plain,
              }}
            >
              Tell me about your
              <br />
              last training session...
            </h1>
          </div>
          <div className="calculator-footer">
            <div
              className="results"
              style={{
                display: results ? "block" : "none",
              }}
            >
              <h3
                style={{
                  color: theme.text_plain,
                }}
              >
                Caloroies burned today:
                <p
                  className="results-span"
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                  }}
                >
                  {caloriesBurned}
                </p>
              </h3>
            </div>
            <button
              className="button button-submit"
              style={{
                backgroundColor: theme.interactable,
                color: theme.text,
                border: theme.border,
              }}
              onClick={() => {
                if (results == true) {
                  showresults(false);
                } else showresults(true);
              }}
            >
              {results == false ? "Conclude my session" : "Next session"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calculator;
