import { registerPlugin } from '../../lib/pluginManager'; // Import the plugin manager
import ImageEmbed from './components/ImageEmbed'; // Import the plugin component
import '../../styles.css';
// Plugin definition
const imageEmbedPlugin = {
  name: 'ImageEmbed',
  register: () => {
    console.log('ImageEmbed plugin registered');
    // Here you can register more logic if needed (e.g., backend API, etc.)
  },
};

// Register the plugin
registerPlugin(imageEmbedPlugin);
