import { useState } from "react";
import { useTheme } from "../../Theme/Theme";
import "./Calculator.css";
import config from "../../config";
import { Select, MenuItem } from "@mui/material";
import { toast } from "react-hot-toast";
import { authenticatedFetch } from '../../utils/api';

interface WorkoutData {
  heart_avg: number;
  workout_type: string;
  duration_hours: number;
  duration_minutes: number;
  duration: number;
  water_intake: number;
}

function Calculator() {
  const { theme } = useTheme();
  const [results, showResults] = useState(false);
  const userdata = localStorage.getItem("user");
  var user: any = null;
  if (userdata) user = JSON.parse(userdata);
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    heart_avg: NaN,
    workout_type: "Select workout type",
    duration_hours: NaN,
    duration_minutes: NaN,
    duration: 0,
    water_intake: NaN,
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
    // Validation checks
    if (
      !workoutData.workout_type ||
      workoutData.workout_type === "Select workout type"
    ) {
      toast.error("Please select a workout type", {
        style: {
          background: theme.element,
          color: theme.text_plain,
          borderRadius: "15px",
        },
      });
      return;
    }

    if (workoutData.duration <= 0) {
      toast.error("Please enter a valid duration", {
        style: {
          background: theme.element,
          color: theme.text_plain,
          borderRadius: "15px",
        },
      });
      return;
    }

    if (workoutData.water_intake < 0) {
      toast.error("Please enter a valid water intake", {
        style: {
          background: theme.element,
          color: theme.text_plain,
          borderRadius: "15px",
        },
      });
      return;
    }

    if (
      workoutData.heart_avg <= 0 
    ) {
      toast.error("Please enter all heart rate values", {
        style: {
          background: theme.element,
          color: theme.text_plain,
          borderRadius: "15px",
        },
      });
      return;
    }
    // If all validations pass, proceed with the API call
    try {
      const response = await authenticatedFetch(`${config.url}api/calculate-calories/`, {
        method: "POST",
        body: JSON.stringify({
          session: {
            id: user.id,
            Age: user.age,
            Weight: user.weight,
            Gender: user.gender == "M" ? "Male" : "Female",
            BMI: user.bmi,
            Session_Duration: workoutData.duration,
            Fat_Percentage: user.fat_percentage,
            Workout_Type: workoutData.workout_type,
            Water_Intake: workoutData.water_intake,
            Avg_BPM: workoutData.heart_avg,
            Experience_level: user.experience_level,
            Workout_Frequency: user.workout_frequency,
            Height: user.height,
          },
        }),
      });

      if (response?.ok) {
        const data = await response?.json();
        toast.success(
          <div>
            <h2
              style={{
                color: theme.text_plain,
                fontSize: "calc(0.8rem + 0.3vw)",
                marginBottom: "4px",
              }}
            >
              Congratulations! 🎉
            </h2>
            <h3
              style={{
                color: theme.text_plain,
                fontSize: "calc(0.6rem + 0.2vw)",
              }}
            >
              Calories burned: {Math.round(data.calories_burned)} kcal
            </h3>
          </div>,
          {
            duration: 5000,
            style: {
              background: theme.element,
              padding: "12px",
              borderRadius: "15px",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.32)",
              maxWidth: "280px",
            },
          }
        );
        showResults(true);
      } else {
        toast.error("Failed to calculate calories", {
          style: {
            background: theme.element,
            color: theme.text_plain,
            borderRadius: "15px",
          },
        });
      }
    } catch (err) {
      toast.error("Network error occurred", {
        style: {
          background: theme.element,
          color: theme.text_plain,
          borderRadius: "15px",
        },
      });
    }
  };

  return (
    <>
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
                  name="heart_avg"
                  placeholder="Average"
                  value={isNaN(workoutData.heart_avg) ? "" : workoutData.heart_avg}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                />
              
              </div>
            </div>

            <div className="input-group">
              <label style={{ color: theme.text_plain }}>
                What kind of workout did you do?
              </label>
              <Select
                name="workout_type"
                className="workout-select"
                value={workoutData.workout_type}
                onChange={handleInputChange}
                sx={{
                  backgroundColor: theme.interactable,
                  color: theme.text_plain,
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                  borderRadius: "15px",
                  outline: "none",
                  "& .MuiSelect-select": {
                    padding: "10px",
                    color: theme.text,
                  },
                  "& .MuiMenuItem-root": {
                    backgroundColor: theme.background,
                    color: theme.text,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: theme.interactable,
                      borderRadius: "15px",
                      "& .MuiMenuItem-root": {
                        color: theme.text,
                      },
                      "& .MuiMenuItem-root:hover": {
                        bgcolor: theme.interactable,
                      },
                    },
                  },
                }}
              >
                <MenuItem value="Select workout type">
                  Select workout type
                </MenuItem>
                <MenuItem value="Strength">Strength</MenuItem>
                <MenuItem value="HIIT">HIIT</MenuItem>
                <MenuItem value="Yoga">Yoga</MenuItem>
                <MenuItem value="Cardio">Cardio</MenuItem>
              </Select>
            </div>

            <div className="input-group">
              <label style={{ color: theme.text_plain }}>
                How long was your session?
              </label>
              <div className="duration-inputs">
                <input
                  type="number"
                  name="duration_hours"
                  placeholder="Hours"
                  min="0"
                  max="24"
                  value={isNaN(workoutData.duration_hours) ? "" : workoutData.duration_hours}
                  onChange={(e) => {
                    const hours = e.target.value === "" ? NaN : parseInt(e.target.value);
                    const minutes = isNaN(workoutData.duration_minutes) ? 0 : workoutData.duration_minutes;
                    const duration = (isNaN(hours) ? 0 : hours) + minutes / 60;
                    setWorkoutData((prev) => ({
                      ...prev,
                      duration_hours: hours,
                      duration: duration,
                    }));
                  }}
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                />
                <input
                  type="number"
                  name="duration_minutes"
                  placeholder="Minutes"
                  min="0"
                  max="59"
                  value={isNaN(workoutData.duration_minutes) ? "" : workoutData.duration_minutes}
                  onChange={(e) => {
                    const minutes = e.target.value === "" ? NaN : parseInt(e.target.value);
                    const hours = isNaN(workoutData.duration_hours) ? 0 : workoutData.duration_hours;
                    const duration = hours + (isNaN(minutes) ? 0 : minutes) / 60;
                    setWorkoutData((prev) => ({
                      ...prev,
                      duration_minutes: minutes,
                      duration: duration,
                    }));
                  }}
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div className="input-group">
              <label style={{ color: theme.text_plain }}>
                How much water did you drink?
              </label>
              <input
                type="number"
                name="water_intake"
                className="water-input"
                placeholder="Water in liters"
                value={isNaN(workoutData.water_intake) ? "" : workoutData.water_intake}
                onChange={handleInputChange}
                style={{
                  backgroundColor: theme.interactable,
                  color: theme.text,
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>
        <div className="calculator-footer">
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
                  heart_avg: 0,
                  workout_type: "Select workout type",
                  duration_hours: NaN,
                  duration_minutes: NaN,
                  duration: 0,
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
    </>
  );
}

export default Calculator;
