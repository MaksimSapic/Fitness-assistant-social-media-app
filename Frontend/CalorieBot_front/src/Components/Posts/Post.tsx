import { Avatar } from "@mui/material";
import { useTheme } from "../../Theme/Theme";
import { useState } from "react";
import AttachmentModal from "./AttachmentModal";

interface PostProps {
  post: any;
  formatTimestamp: (timestamp: string) => string;
}

function Post({ post, formatTimestamp }: PostProps) {
  const { theme } = useTheme();
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const renderAttachment = () => {
    if (!post.attachments || post.attachments.length === 0) return null;
    
    const attachment = post.attachments[0];
    
    const handleAttachmentClick = async () => {
      if (attachment.file_type.startsWith('image/')) {
        const img = new Image();
        img.src = `data:${attachment.file_type};base64,${attachment.file}`;
        img.onload = () => {
          setSelectedAttachment({
            ...attachment,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
          });
          setModalOpen(true);
        };
      } else {
        setSelectedAttachment(attachment);
        setModalOpen(true);
      }
    };

    if (attachment.file_type.startsWith('image/')) {
      return (
        <div className="post-attachment" onClick={handleAttachmentClick} style={{ cursor: 'pointer' }}>
          <img
            src={`data:${attachment.file_type};base64,${attachment.file}`}
            alt="Post attachment"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
        </div>
      );
    } else if (attachment.file_type === 'application/pdf') {
      return (
        <div className="post-attachment" onClick={handleAttachmentClick} style={{ cursor: 'pointer' }}>
          <div className="pdf-preview">📄 {attachment.file_name}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div
        className="post"
        style={{ backgroundColor: theme.background }}
      >
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