import Calculator from "../../Components/Calculator/Calculator";
import "./Home.css";
function Home() {
  return (
    <>
      <div className="wrapper">
        <Calculator></Calculator>
        <div className="stats">statsdiv</div>
      </div>
    </>
  );
}

export default Home;
