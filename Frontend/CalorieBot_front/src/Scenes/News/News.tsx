import { useTheme } from "../../Theme/Theme";
import "./News.css";
function News() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <div className="flex">
        <div
          className="screen-element posts"
          style={{
            backgroundColor: theme.element,
          }}
        ></div>
        <div
          className="screen-element sidebar"
          style={{
            backgroundColor: theme.element,
          }}
        ></div>
      </div>
    </>
  );
}

export default News;
