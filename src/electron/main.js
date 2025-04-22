import { app, BrowserWindow } from "electron";
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
