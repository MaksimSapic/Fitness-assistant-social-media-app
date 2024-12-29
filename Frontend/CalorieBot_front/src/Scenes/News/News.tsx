import CreatePost from "../../Components/CreatePost/CreatePost";
import NewsSideBar from "../../Components/NewsSidebar/NewsSideBar";
import Posts from "../../Components/Posts/Posts";
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
        >
          <CreatePost />
          <Posts />
        </div>
        <NewsSideBar />
      </div>
    </>
  );
}

export default News;
