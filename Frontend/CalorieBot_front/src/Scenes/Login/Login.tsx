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
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("tokens", JSON.stringify(data.tokens));
        navigate("/home");
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
          <h1 style={{ color: theme.text_plain }}>Welcome to CalorieBot </h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  backgroundColor: theme.interactable,
                  color: theme.text,
                }}
                required
              />
            </div>
            <a
              href="#"
              className="forgotpassword"
              style={{ color: theme.text_plain }}
            >
              Forgotten password?
            </a>
            <br />

            <button
              type="submit"
              className="button button-login"
              style={{
                border: `2px solid ${theme.interactable}`,
                backgroundColor: theme.element,
                color: theme.text_plain,
              }}
            >
              Login
            </button>
            <br />
            <Link
              to="/register"
              className="register"
              style={{
                color: theme.text_plain,
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
