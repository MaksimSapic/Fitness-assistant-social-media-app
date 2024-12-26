import { useState, useRef } from "react";
import { useTheme } from "../../Theme/Theme";
import "./CreatePost.css";
import { AttachFile, Close } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { authenticatedFetch, postFetch } from "../../utils/api";
import config from "../../config";

function CreatePost() {
  const [createpost, setCreatePost] = useState(false);
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        setPreview(URL.createObjectURL(file));
      }
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", "New Post");
    formData.append("content", content);
    if (attachment) {
      formData.append("file", attachment);
    }

    try {
      const response = await postFetch(
        `${config.url}api/posts/`,
        {
          method: "POST",
          body: formData
        }
      );

      if (response?.ok) {
        setCreatePost(false);
        setContent("");
        removeAttachment();
      } else {
        console.error("Failed to create post:", await response?.text());
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="create-post-wrap">
      <button
        className="button-initial"
        onClick={() => setCreatePost(!createpost)}
        style={{
          backgroundColor: theme.interactable,
          color: theme.text_plain,
          borderRadius: 15,
          display: createpost ? "none" : "block",
        }}
      >
        <strong>Create a new post 📝</strong>
      </button>
      <div className={`createpost ${createpost ? "expanded" : ""}`}>
        <div className="post-main">
          <input
            className="createpost-input"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            style={{
              backgroundColor: theme.element,
              color: theme.text_plain,
              border: `1px solid ${theme.interactable}`,
            }}
          />

          {attachment && (
            <div className="attachment-preview">
              {attachment.type.startsWith("image/") ? (
                <img src={preview!} alt="Preview" />
              ) : attachment.type === "application/pdf" && preview ? (
                <iframe src={preview} title="PDF preview" />
              ) : null}
              <div className="attachment-name">
                {attachment.name}
                <IconButton size="small" onClick={removeAttachment}>
                  <Close />
                </IconButton>
              </div>
            </div>
          )}
        </div>

        <div className="post-footer">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="file-input"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
            <Tooltip title="Attach file">
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                style={{ color: theme.text_plain }}
              >
                <AttachFile />
              </IconButton>
            </Tooltip>
          </div>

          <div style={{ padding: 0 }}>
            <button
              className="button cancel"
              style={{
                backgroundColor: theme.interactable,
                color: theme.text_plain,
              }}
              onClick={() => {
                setCreatePost(false);
                setContent("");
                removeAttachment();
              }}
            >
              Cancel
            </button>
            <button
              className="button confirm-post"
              style={{
                backgroundColor: theme.interactable,
                color: theme.text_plain,
              }}
              onClick={handleSubmit}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
