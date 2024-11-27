// pages/editor.tsx (or wherever you handle content editing)
import React, { useState } from 'react';
import { getPlugins } from '../../../lib/pluginManager';  // Import the plugin manager
import ImageEmbed from './ImageEmbed';

const Editor: React.FC = () => {
  const [content, setContent] = useState<string>('');

  const handleEmbedImage = (imageUrl: string) => {
    setContent((prevContent) => `${prevContent}<img src="${imageUrl}" alt="Embedded Image" />`);
  };

  // Load the plugins and display their components (for now, we just show the ImageEmbed plugin)
  const plugins = getPlugins();

  return (
    <div>
      <h1>Content Editor</h1>

      <div>
        {plugins.map((plugin) => {
          if (plugin.name === 'ImageEmbed') {
            return (
              <div key={plugin.name}>
                <h3>Embed an Image</h3>
                <ImageEmbed onEmbed={handleEmbedImage} />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div>
        <h3>Content Preview</h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default Editor;
