// plugins/imageEmbed/components/ImageEmbed.tsx
import React, { useState } from 'react';
import "../../../styles.css"

interface ImageEmbedProps {
  onEmbed: (url: string) => void;
}

const ImageEmbed: React.FC<ImageEmbedProps> = ({ onEmbed }) => {
  const [imageUrl, setImageUrl] = useState('');

  const handleEmbed = () => {
    if (imageUrl) {
      onEmbed(imageUrl);  // Pass the URL to the parent (CMS editor)
    }
  };

  return (
    <div className="image-embed">
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Enter Image URL"
      />
      <button onClick={handleEmbed}>Add Image</button>
    </div>
  );
};

export default ImageEmbed;
