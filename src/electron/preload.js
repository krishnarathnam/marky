// preload.js
const { contextBridge, ipcRenderer } = require('electron')

console.log('Preload script running');

contextBridge.exposeInMainWorld('electron', {
  createSubfolder: (folderName) => ipcRenderer.invoke('create-subfolder', folderName),
  getFolders: () => ipcRenderer.invoke('get-folders'),
  deleteFolder: (folderName) => ipcRenderer.invoke('delete-folder', folderName),
});
