import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Home from "./Scenes/Home/Home";
import Settings from "./Scenes/Settings/Settings";
import News from "./Scenes/News/News";
import Profile from "./Scenes/Profile/Profile";
import Login from "./Scenes/Login/Login";
import ProtectedRoute from "./Routes/ProtectedRoute";
import Register from "./Scenes/Register/Register";
function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <>
                  <Navbar />
                  <Outlet />
                </>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<News />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
