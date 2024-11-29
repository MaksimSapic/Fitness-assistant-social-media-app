import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../config";
import "./Login.css";
import { useTheme } from "../../Theme/Theme";

function Login() {
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${config.url}api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage or state management solution
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/"); // Redirect to home page
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  return (
    <div className="login-container">
      <div className="wrap">
        <div
          className=" screen-element login-box"
          style={{
            backgroundColor: theme.element,
          }}
        >
          <h1>Welcome back </h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <a
              href="#"
              className="forgotpassword"
              style={{ color: theme.text }}
            >
              Forgotten password?
            </a>
            <br />

            <button
              type="submit"
              className="button button-login"
              style={{ backgroundColor: theme.interactable }}
            >
              Login
            </button>
            <br />
            <Link
              to="/register"
              className="register"
              style={{
                backgroundColor: theme.interactable,
                color: theme.text,
              }}
            >
              Register now!
            </Link>
            <br />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
