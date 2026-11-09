const { contextBridge, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  openExternal: (url) => {
    if (url && typeof url === 'string') {
      shell.openExternal(url);
    }
  }
});
