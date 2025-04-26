import { app, BrowserWindow, ipcMain, dialog } from "electron";
// import path from "path";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
  });
  mainWindow.loadURL("http://localhost:5173");
  // mainWindow.loadFile(path.join(app.getAppPath(), "dist-react", "index.html"));
});

ipcMain.handle('dialog:openCreateFolder', async () => {
  const result = await dialog.showInputBox({
    title: 'New Folder Name',
    prompt: 'Enter a name for the new folder:',
  });
  return result;
});
