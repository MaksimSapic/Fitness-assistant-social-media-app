import { useEffect, useState } from "react";
import { useTheme } from "../../Theme/Theme";
import { authenticatedFetch } from "../../utils/api";
import config from "../../config";
import "./Posts.css";
function Posts() {
  const { theme, toggleTheme } = useTheme();
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const getPosts = async () => {
      const response = await authenticatedFetch(
        `${config.url}api/posts/`,
        {
          method: "GET",
        }
      );
      if(response && response.ok){
        const data = await response.json();
        setPosts(data);
        console.log(posts)
      }
    };

    getPosts();
  }, []);

  return (
    <>
      <div className="posts-wrap" style={{ color: theme.text_plain }}>
        {posts.map((post: {id: string, content: string}) => (
          <div key={post.id} className="post">
            <div className="post-header">
                
            </div>
            <div className="post-main"></div>
            <div className="post-footer"></div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Posts;
