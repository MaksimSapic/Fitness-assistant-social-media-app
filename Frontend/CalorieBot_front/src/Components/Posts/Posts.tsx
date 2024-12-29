import { useEffect, useState, useRef } from "react";
import { useTheme } from "../../Theme/Theme";
import { authenticatedFetch } from "../../utils/api";
import config from "../../config";
import "./Posts.css";
import { Avatar, CircularProgress } from "@mui/material";
import AttachmentModal from "./AttachmentModal";
import Post from "./Post";

function Posts() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const getPosts = async (url: string) => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(url, {
        method: "GET",
      });
      if (response && response.ok) {
        const data = await response.json();
        setPosts(prev => {
          const existingIds = new Set(prev.map((post: any) => post.id));
          const newPosts = data.results.filter((post: any) => !existingIds.has(post.id));
          return [...prev, ...newPosts];
        });
        setNextPage(data.next);
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
      entries => {
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

  return (
    <>
      <div className="posts-wrap" style={{ color: theme.text_plain }}>
        {posts.map((post: any) => (
          <Post key={post.id} post={post} formatTimestamp={formatTimestamp} />
        ))}
        <div ref={observerTarget} style={{ height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {loading && <CircularProgress size={30} style={{ color: theme.text_plain }} />}
        </div>
      </div>
      <AttachmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        attachment={selectedAttachment}
      />
    </>
  );
}

export default Posts;
