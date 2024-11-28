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
            <div className="inputs">
              <div className="input-group">
                <label style={{ color: theme.text_plain }}>
                  How was your heart rate?
                </label>
                <div className="heart-rate-inputs">
                  <input
                    type="number"
                    placeholder="Max"
                    style={{
                      backgroundColor: theme.interactable,
                      color: theme.text,
                      border: "1px solid " + theme.border,
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Average"
                    style={{
                      backgroundColor: theme.interactable,
                      color: theme.text,
                      border: "1px solid " + theme.border,
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Rest"
                    style={{
                      backgroundColor: theme.interactable,
                      color: theme.text,
                      border: "1px solid " + theme.border,
                    }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label style={{ color: theme.text_plain }}>
                  What type of workout did you do?
                </label>
                <select
                  className="workout-select"
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                    border: "1px solid " + theme.border,
                  }}
                >
                  {/* this we drag out the database most likely */}
                  <option value="">Select workout type</option>
                  <option value="running">Running</option>
                  <option value="cycling">Cycling</option>
                  <option value="swimming">Swimming</option>
                  <option value="weightlifting">Weightlifting</option>
                </select>
              </div>

              <div className="input-group">
                <label style={{ color: theme.text_plain }}>
                  How long was your session?
                </label>
                <input
                  type="time"
                  className="timer-input"
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                    border: "1px solid " + theme.border,
                  }}
                />
              </div>

              <div className="input-group">
                <label style={{ color: theme.text_plain }}>
                  How much water did you drink?
                </label>
                <input
                  type="number"
                  className="water-input"
                  placeholder="Water in liters"
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                    border: "1px solid " + theme.border,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="calculator-footer">
            <div className={`results results${results ? "-show" : ""}`}>
              <h2
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
              </h2>
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
