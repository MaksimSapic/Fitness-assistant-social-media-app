import { Modal, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { authenticatedFetch } from '../../utils/api';
import config from '../../config';

interface AttachmentModalProps {
  open: boolean;
  onClose: () => void;
  attachment: any | null;
}

function AttachmentModal({ open, onClose, attachment }: AttachmentModalProps) {
  const [fullAttachment, setFullAttachment] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: '80vw', height: '80vh' });

  useEffect(() => {
    if (!attachment) return;

    if (attachment.file_type.startsWith('image/') && attachment.naturalWidth) {
      const aspectRatio = attachment.naturalWidth / attachment.naturalHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate maximum dimensions (80% of viewport)
      const maxWidth = viewportWidth * 0.8;
      const maxHeight = viewportHeight * 0.8;
      
      let width, height;
      
      if (attachment.naturalWidth > maxWidth || attachment.naturalHeight > maxHeight) {
        if (aspectRatio > 1) {
          // Landscape
          width = Math.min(maxWidth, attachment.naturalWidth);
          height = width / aspectRatio;
          
          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        } else {
          // Portrait
          height = Math.min(maxHeight, attachment.naturalHeight);
          width = height * aspectRatio;
          
          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
        }
      } else {
        width = attachment.naturalWidth;
        height = attachment.naturalHeight;
      }
      
      setDimensions({
        width: `${width}px`,
        height: `${height}px`
      });
    } else {
      // Default dimensions for PDFs
      setDimensions({ width: '80vw', height: '80vh' });
    }
  }, [attachment]);

  useEffect(() => {
    const fetchFullAttachment = async () => {
      if (!attachment) return;
      
      try {
        const response = await authenticatedFetch(
          `${config.url}api/posts/${attachment.post}/attachments/`,
          { method: 'GET' }
        );
        if (response?.ok) {
          const data = await response.json();
          setFullAttachment(data[0].file);
          
          // For images, load and check dimensions
          if (attachment.file_type.startsWith('image/')) {
            const img = new Image();
            img.src = `data:${attachment.file_type};base64,${data[0].file}`;
            img.onload = () => {
              const aspectRatio = img.width / img.height;
              if (aspectRatio > 1) {
                // Landscape image
                setDimensions({
                  width: '80vw',
                  height: `${Math.min(80, (80 / aspectRatio))}vh`
                });
              } else {
                // Portrait image
                setDimensions({
                  width: `${Math.min(80, (80 * aspectRatio))}vw`,
                  height: '80vh'
                });
              }
            };
          } else {
            // For PDFs, use default dimensions
            setDimensions({ width: '80vw', height: '80vh' });
          }
        }
      } catch (error) {
        console.error('Error fetching full attachment:', error);
      }
    };

    if (open && attachment) {
      fetchFullAttachment();
    }
  }, [open, attachment]);

  if (!attachment) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="attachment-modal"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: '90vw',
          maxHeight: '90vh',
          outline: 'none',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto'
        }}
      >
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {attachment.file_type.startsWith('image/') ? (
            <img
              src={`data:${attachment.file_type};base64,${fullAttachment || attachment.file}`}
              alt="Full size attachment"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <iframe
              src={`data:${attachment.file_type};base64,${fullAttachment || attachment.file}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="PDF Viewer"
            />
          )}
        </div>
      </Box>
    </Modal>
  );
}

export default AttachmentModal; 