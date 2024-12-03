import { useState } from "react";
import { useTheme } from "../../Theme/Theme";
import "./Calculator.css";
import config from "../../config";

interface WorkoutData {
  heart_max: number;
  heart_avg: number;
  heart_rest: number;
  workout_type: string;
  duration: string;
  water_intake: number;
}

function Calculator() {
  const { theme } = useTheme();
  const [results, showResults] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(0);
  const userdata = localStorage.getItem("user");
  var user: any = null;
  if (userdata) user = JSON.parse(userdata);
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    heart_max: 0,
    heart_avg: 0,
    heart_rest: 0,
    workout_type: "",
    duration: "00:00",
    water_intake: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setWorkoutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateCalories = async () => {
    console.log(user);
    try {
      const response = await fetch(`${config.url}api/calculate-calories/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: {
            Age: user.age,
            Weight: user.weight,
            Gender: user.gender == "M" ? "Male" : "Female",
            BMI: user.bmi,
            Session_Duration: workoutData.duration,
            Fat_Percentage: user.fat_percentage,
            Workout_Type: workoutData.workout_type,
            Water_Intake: workoutData.water_intake,
            Avg_BPM: workoutData.heart_avg,
            Max_BPM: workoutData.heart_max,
            Rest_BPM: workoutData.heart_rest,
            Experience_level: user.experience_level,
            Workout_Frequency: user.workout_frequency,
            Height: user.height,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCaloriesBurned(data.calories);
        showResults(true);
      } else {
        console.error("Failed to calculate calories");
      }
    } catch (error) {
      console.error("Error calculating calories:", error);
    }
  };

  return (
    <>
      <div className="container">
        <div
          className="screen-element"
          style={{
            backgroundColor: theme.element,
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
                    name="heart_max"
                    placeholder="Max"
                    value={workoutData.heart_max}
                    onChange={handleInputChange}
                    style={{
                      backgroundColor: theme.interactable,
                      color: theme.text,
                      border: "1px solid " + theme.border,
                    }}
                  />
                  <input
                    type="number"
                    name="heart_avg"
                    placeholder="Average"
                    value={workoutData.heart_avg}
                    onChange={handleInputChange}
                    style={{
                      backgroundColor: theme.interactable,
                      color: theme.text,
                      border: "1px solid " + theme.border,
                    }}
                  />
                  <input
                    type="number"
                    name="heart_rest"
                    placeholder="Rest"
                    value={workoutData.heart_rest}
                    onChange={handleInputChange}
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
                  What kind of workout did you do?
                </label>
                <select
                  name="workout_type"
                  className="workout-select"
                  value={workoutData.workout_type}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                    border: "1px solid " + theme.border,
                  }}
                >
                  {/* this we drag out the database most likely */}
                  <option value="">Select workout type</option>
                  <option value="Strength">Strength</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Cardio">Cardio</option>
                </select>
              </div>

              <div className="input-group length">
                <label style={{ color: theme.text_plain }}>
                  How long was your session?
                </label>
                <input
                  type="number"
                  name="duration"
                  className="timer-input"
                  value={workoutData.duration}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                    border: "1px solid " + theme.border,
                  }}
                />
              </div>

              <div className="input-group water">
                <label style={{ color: theme.text_plain }}>
                  How much water did you drink?
                </label>
                <input
                  type="number"
                  name="water_intake"
                  className="water-input"
                  placeholder="Water in liters"
                  value={workoutData.water_intake}
                  onChange={handleInputChange}
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
              <h3
                style={{
                  color: theme.text_plain,
                }}
              >
                Congratulations on your workout,
                <br />
                today you burned this many calories:
                <br />
                <p
                  className="results-span"
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                    fontWeight: 100,
                  }}
                >
                  {caloriesBurned + " kcal"}
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
                if (results) {
                  showResults(false);
                  setWorkoutData({
                    heart_max: 0,
                    heart_avg: 0,
                    heart_rest: 0,
                    workout_type: "",
                    duration: "00:00",
                    water_intake: 0,
                  });
                } else {
                  calculateCalories();
                }
              }}
            >
              {results ? "Next session" : "Conclude my session"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calculator;
