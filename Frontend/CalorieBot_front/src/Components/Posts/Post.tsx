import { Avatar } from "@mui/material";
import { useTheme } from "../../Theme/Theme";
import { useState } from "react";
import AttachmentModal from "./AttachmentModal";
import { authenticatedFetch } from "../../utils/api";
import config from "../../config";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

interface PostProps {
  post: {
    id: number;
    content: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      profile_picture_avatar: string;
      profile_picture_type: string;
    };
    attachments: any[];
  };
  formatTimestamp: (timestamp: string) => string;
  onLikeToggle?: (postId: number) => void;
}

function Post({ post, formatTimestamp, onLikeToggle }: PostProps) {
  const { theme } = useTheme();
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLike = async () => {
    try {
      const response = await authenticatedFetch(
        `${config.url}api/posts/${post.id}/like/`,
        {
          method: isLiked ? "DELETE" : "POST",
        }
      );

      if (response?.ok) {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
        onLikeToggle?.(post.id);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  const renderAttachment = () => {
    if (!post.attachments || post.attachments.length === 0) return null;

    const attachment = post.attachments[0];
    if (!attachment || !attachment.file_type) return null;

    const handleAttachmentClick = async () => {
      if (attachment.file_type.startsWith("image/")) {
        const img = new Image();
        img.src = `data:${attachment.file_type};base64,${attachment.file}`;
        img.onload = () => {
          setSelectedAttachment({
            ...attachment,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
          });
          setModalOpen(true);
        };
      } else {
        setSelectedAttachment(attachment);
        setModalOpen(true);
      }
    };

    if (attachment.file_type.startsWith("image/")) {
      return (
        <div
          className="post-attachment"
          onClick={handleAttachmentClick}
          style={{ cursor: "pointer" }}
        >
          <img
            src={`data:${attachment.file_type};base64,${attachment.file}`}
            alt="Post attachment"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        </div>
      );
    } else if (attachment.file_type === "application/pdf") {
      return (
        <div
          className="post-attachment"
          onClick={handleAttachmentClick}
          style={{ cursor: "pointer" }}
        >
          <div className="pdf-preview">📄 {attachment.file_name}</div>
        </div>
      );
    }
    return null;
  };

  const renderFooter = () => (
    <div
      className="post-footer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "15px",
        marginTop: "10px",
      }}
    >
      <div
        onClick={handleLike}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          color: isLiked ? "#ff4081" : theme.text,
        }}
      >
        {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        <span>{likesCount}</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          color: theme.text,
        }}
      >
        <ChatBubbleOutlineIcon />
        <span>{post.comments_count}</span>
      </div>
    </div>
  );

  return (
    <>
      <div className="post" style={{ backgroundColor: theme.interactable }}>
        <div className="post-header">
          {post.user.profile_picture_avatar ? (
            <img
              src={`data:${post.user.profile_picture_type};base64,${post.user.profile_picture_avatar}`}
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              alt="Profile"
            />
          ) : (
            <Avatar sx={{ width: 40, height: 40 }} />
          )}
          <div style={{ marginLeft: "10px" }}>
            <div style={{ fontWeight: "bold" }}>
              {post.user.first_name} {post.user.last_name}
            </div>
            <div style={{ fontSize: "0.8em", opacity: 0.7 }}>
              {formatTimestamp(post.created_at)}
            </div>
          </div>
        </div>
        <div className="post-main">{post.content}</div>
        {renderAttachment()}
        {renderFooter()}
      </div>
      <AttachmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        attachment={selectedAttachment}
      />
    </>
  );
}

export default Post;
