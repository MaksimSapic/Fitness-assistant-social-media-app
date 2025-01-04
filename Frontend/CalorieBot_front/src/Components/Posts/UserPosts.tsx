import { useEffect, useState, useRef } from "react";
import { useTheme } from "../../Theme/Theme";
import { authenticatedFetch } from "../../utils/api";
import config from "../../config";
import "../Posts/Posts.css";
import { CircularProgress } from "@mui/material";
import Post from "./Post";

function UserPosts() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const userdata = localStorage.getItem("user");
  const user = userdata ? JSON.parse(userdata) : null;

  const getPosts = async (url: string) => {
    setLoading(true);
    try {
      const separator = url.includes("?") ? "&" : "?";
      const response = await authenticatedFetch(
        `${url}${separator}user=${user.id}`,
        {
          method: "GET",
        }
      );
      if (response && response.ok) {
        const data = await response.json();
        setPosts((prev) => {
          const existingIds = new Set(prev.map((post: any) => post.id));
          const newPosts = data.results.filter(
            (post: any) => !existingIds.has(post.id)
          );
          return [...prev, ...newPosts];
        });
        if (data.next) {
          const nextUrl = new URL(data.next);
          nextUrl.searchParams.set("user", user.id);
          setNextPage(nextUrl.toString());
        } else {
          setNextPage(null);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts(`${config.url}api/posts/`);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPage && !loading) {
          getPosts(nextPage);
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [nextPage, loading]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleLikeToggle = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              is_liked: !post.is_liked,
              likes_count: post.is_liked
                ? post.likes_count - 1
                : post.likes_count + 1,
            }
          : post
      )
    );
  };

  return (
    <>
      <div className="posts-wrap" style={{ color: theme.text }}>
        {posts.map((post: any) => (
          <Post
            key={post.id}
            post={post}
            formatTimestamp={formatTimestamp}
            onLikeToggle={handleLikeToggle}
          />
        ))}
        <div
          ref={observerTarget}
          style={{
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading && (
            <CircularProgress size={30} style={{ color: theme.text }} />
          )}
        </div>
      </div>
    </>
  );
}

export default UserPosts;
