import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs-extra';
import os from 'os';
import matter from 'gray-matter';
import Store from 'electron-store'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MARKY_FOLDER = path.join(os.homedir(), 'marky');
const store = new Store();

function createWindow() {
  // Log the preload path to verify it's correct
  const preloadPath = path.resolve(__dirname, 'preload.js');
  console.log('Looking for preload script at:', preloadPath);
  console.log('File exists:', fs.existsSync(preloadPath));

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(process.resourcesPath, 'app.asar', 'dist-react', 'index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  const username = store.get('username');
  if (!username) {
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow.webContents.send('show-username-prompt');
    });
  }

}

ipcMain.handle('save-username', async (event, username) => {
  store.set('username', username);
  return { success: true };
});

ipcMain.handle('get-username', async () => {
  return store.get('username') || null;
});

function ensureMarkyFolder() {
  const homeDir = os.homedir();
  const markyPath = path.join(homeDir, 'marky');
  const welcomePath = path.join(markyPath, 'Welcome');

  fs.ensureDir(markyPath)
    .then(() => {
      console.log('Marky folder is ready at:', markyPath);
    })
    .catch((err) => {
      console.error('Error creating Marky folder:', err);
    });

  fs.ensureDir(welcomePath)
    .then(() => {
      console.log('Welcome folder is ready at:', welcomePath);
    })
    .catch((err) => {
      console.error('Error creating Welcome folder:', err);
    });
}

// Add all IPC handlers before the app is ready
ipcMain.handle('create-subfolder', async (event, folderName) => {
  try {
    const subfolderPath = path.join(MARKY_FOLDER, folderName);
    await fs.ensureDir(subfolderPath);
    return { success: true, path: subfolderPath };
  } catch (error) {
    console.error('Failed to create subfolder:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-all-notes', async () => {
  let notes = [];
  try {
    const folderPath = path.join(MARKY_FOLDER);
    const folders = await fs.readdir(folderPath);

    const getNotesFromFolder = async (folder) => {
      const folderFullPath = path.join(folderPath, folder);
      const stats = await fs.stat(folderFullPath);

      if (stats.isDirectory()) {
        const files = await fs.readdir(folderFullPath);
        for (const file of files) {
          const filePath = path.join(folderFullPath, file);
          const fileStats = await fs.stat(filePath);

          if (fileStats.isFile() && filePath.endsWith('.md')) {
            const rawContent = await fs.readFile(filePath, 'utf8');
            const { data, content } = matter(rawContent);

            const lastModified = fileStats.mtime.toLocaleString();

            notes.push({
              name: path.basename(filePath),
              folderName: folder,
              content,
              lastModified,
              isImportant: data.isImportant || false,
            });
          }
        }
      }
    };

    for (const folder of folders) {
      await getNotesFromFolder(folder);
    }

    return notes;
  } catch (error) {
    console.error('Error getting all notes:', error);
    return [];
  }
});


ipcMain.handle('delete-folder', async (event, folderName) => {
  try {
    const folderPath = path.join(MARKY_FOLDER, folderName);

    const exists = await fs.pathExists(folderPath);
    if (!exists) {
      console.log(`Folder does not exist: ${folderPath}`);
      return { success: false, error: "Folder does not exist." };
    }

    await fs.remove(folderPath); // fs-extra's remove method
    return { success: true, path: folderPath };
  } catch (error) {
    console.error('Error deleting folder:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-folders', async () => {
  try {
    // Use fs-extra's readdir which returns a promise
    const files = await fs.readdir(MARKY_FOLDER);

    // Process the files to find directories
    const folders = [];
    for (const file of files) {
      const filePath = path.join(MARKY_FOLDER, file);
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        folders.push(file);
      }
    }

    return folders;
  } catch (error) {
    console.error('Error reading folders:', error);
    return [];
  }
});


ipcMain.handle('get-notes', async (event, folderName) => {
  try {
    const folderPath = path.join(MARKY_FOLDER, folderName);
    console.log(folderName, folderPath)

    const files = await fs.readdir(folderPath);

    const notes = files.filter((fileName) => fileName.endsWith('.md'));

    return notes;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
});

ipcMain.handle('read-notes', async (event, folderName, noteName) => {

  try {

    const folderPath = path.join(MARKY_FOLDER, folderName);
    const notePath = path.join(folderPath, noteName)
    const [rawContent, stat] = await Promise.all([
      fs.readFile(notePath, { encoding: 'utf8', flag: 'r' }),
      fs.stat(notePath)
    ]);

    const lastModified = stat.mtime.toLocaleString()
    const { data, content } = matter(rawContent);
    return {
      content,
      folderName,
      lastModified,
      isImportant: data.isImportant || false,
    };
  } catch (error) {
    console.error('Error reading note:', error)
  }
})

ipcMain.handle('toggle-important', async (event, folderName, noteName, value) => {
  try {
    const folderPath = path.join(MARKY_FOLDER, folderName);
    const notePath = path.join(folderPath, noteName);
    const rawContent = await fs.readFile(notePath, 'utf8');

    console.log(noteName, value);
    const parsed = matter(rawContent);
    parsed.data.isImportant = value;
    console.log(value)
    const updatedContent = matter.stringify(parsed.content, parsed.data);
    await fs.writeFile(notePath, updatedContent, 'utf8');
    console.log(`Toggled important for ${noteName}: ${value}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle important:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-notes', async (event, folderName, noteName, content) => {
  try {
    const folderPath = path.join(MARKY_FOLDER, folderName);
    const notePath = path.join(folderPath, noteName);

    await fs.writeFile(notePath, content, { encoding: 'utf8' });

    return { success: true };
  } catch (error) {
    console.error('Error writing note:', error);
    return { success: false, error: error.message };
  }
});


ipcMain.handle('create-notes', async (event, folderName, noteName) => {
  try {
    const folderPath = path.join(MARKY_FOLDER, folderName);
    const noteFileName = noteName.endsWith('.md') ? noteName : `${noteName}.md`;
    const notePath = path.join(folderPath, noteFileName);

    await fs.writeFile(notePath, `# ${noteName.replace('.md', '')}`, { encoding: 'utf8' });

    console.log('Created new Note:', notePath);
    return { success: true };
  } catch (error) {
    console.error('Error creating note:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-notes', async (event, folderName, noteName) => {
  try {
    const folderPath = path.join(MARKY_FOLDER, folderName);
    const notePath = path.join(folderPath, noteName);

    await fs.unlink(notePath);

    console.log("Deleted note:", noteName);
    return { success: true };
  } catch (error) {
    console.error('Error deleting note:', error)
    return { success: false, error: error.message };
  }
})

ipcMain.handle('rename-notes', async (event, folderName, noteName, newNoteName) => {
  try {
    const folderPath = path.join(MARKY_FOLDER, folderName);
    const oldPath = path.join(folderPath, noteName);
    const newFileName = newNoteName.endsWith('.md') ? newNoteName : `${newNoteName}.md`;
    const newPath = path.join(folderPath, newFileName);

    await fs.rename(oldPath, newPath);

    console.log('Renamed note:', oldPath, 'to', newPath);
    return { success: true };
  } catch (error) {
    console.error("Error renaming note: ", error);
    return { success: false, error: error.message };
  }
}); app.whenReady().then(() => {

  ensureMarkyFolder();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
