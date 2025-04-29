// preload.js
const { contextBridge, ipcRenderer } = require('electron')

console.log('Preload script running');

contextBridge.exposeInMainWorld('electron', {
  createSubfolder: (folderName) => ipcRenderer.invoke('create-subfolder', folderName),
  getFolders: () => ipcRenderer.invoke('get-folders'),
  deleteFolder: (folderName) => ipcRenderer.invoke('delete-folder', folderName),
  getNotes: (folderName) => ipcRenderer.invoke('get-notes', folderName),
  readNotes: (folderName, noteName) => ipcRenderer.invoke('read-notes', folderName, noteName),
  saveNote: (folderName, noteName, content) => ipcRenderer.invoke('write-notes', folderName, noteName, content),
  createNote: (folderName, noteName) => ipcRenderer.invoke('create-notes', folderName, noteName),
});
