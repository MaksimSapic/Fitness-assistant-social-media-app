import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Scenes/Home/Home";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/news" element={<News />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
