import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../Theme/Theme";
import config from "../../config";
import "./Register.css";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";

function Register() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    weight: "",
    height: "",
    gender: "select gender",
    age: "",
    fat_percentage: "",
    workout_frequency: "",
    experience_level: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate first step
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.first_name ||
        !formData.last_name
      ) {
        setError("Please fill in all fields");
        return;
      }
      setError("");
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${config.url}api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  return (
    <div className="register-container">
      <div
        className="screen-element register-box"
        style={{ backgroundColor: theme.element }}
      >
        <h1 style={{ color: theme.text_plain }}>
          {step === 1 ? "Create Account" : "Physical Information"}
        </h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            // Step 1: Account Information
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                  }}
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                  }}
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                  }}
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                  }}
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                  }}
                />
              </div>

              <button
                type="button"
                className="button button-next"
                onClick={handleNext}
                style={{
                  border: `2px solid ${theme.interactable}`,
                  backgroundColor: theme.element,
                  color: theme.text_plain,
                }}
              >
                Next
              </button>
            </>
          ) : (
            // Step 2: Physical Information
            <>
              <div className="form-group">
                <input
                  type="number"
                  name="weight"
                  placeholder="Weight (kg)"
                  value={formData.weight}
                  onChange={handleChange}
                  min="20"
                  max="300"
                  step="0.1"
                  required
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                  }}
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="height"
                  placeholder="Height (m)"
                  value={formData.height}
                  onChange={handleChange}
                  min="0.5"
                  max="3"
                  step="0.01"
                  required
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                  }}
                />
              </div>

              <div className="form-group">
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  sx={{
                    backgroundColor: theme.interactable,
                    color: theme.text_plain,
                    width: "72%",
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
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </Select>
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="age"
                  placeholder="Age (13-120)"
                  value={formData.age}
                  onChange={handleChange}
                  min="13"
                  max="120"
                  required
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                  }}
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="fat_percentage"
                  placeholder="Body Fat % (2-70)"
                  value={formData.fat_percentage}
                  onChange={handleChange}
                  min="2"
                  max="70"
                  step="0.1"
                  required
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                  }}
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="workout_frequency"
                  placeholder="Weekly Workouts (1-5)"
                  value={formData.workout_frequency}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  required
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                  }}
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="experience_level"
                  placeholder="Experience Level (1-10)"
                  value={formData.experience_level}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                  style={{
                    backgroundColor: theme.interactable,
                    color: theme.text,
                  }}
                />
              </div>

              <div className="button-group">
                <button
                  type="button"
                  className="button button-back"
                  onClick={handleBack}
                  style={{
                    border: `2px solid ${theme.interactable}`,
                    backgroundColor: theme.element,
                    color: theme.text_plain,
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="button button-register"
                  style={{
                    border: `2px solid ${theme.interactable}`,
                    backgroundColor: theme.element,
                    color: theme.text_plain,
                  }}
                >
                  Register
                </button>
              </div>
            </>
          )}
        </form>

        <Link
          to="/login"
          className="login-link"
          style={{ color: theme.text_plain }}
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}

export default Register;
