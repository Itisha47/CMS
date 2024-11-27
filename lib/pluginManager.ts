// lib/pluginManager.ts

// An array to store registered plugins
let plugins: any[] = [];

// Register a plugin
export const registerPlugin = (plugin: any) => {
  plugins.push(plugin);
  console.log(`Plugin "${plugin.name}" registered`);
};

// Optionally, export the list of plugins to be used elsewhere
export const getPlugins = () => plugins;
