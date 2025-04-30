import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs-extra';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MARKY_FOLDER = path.join(os.homedir(), 'marky');

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

  mainWindow.loadURL('http://localhost:5173');
}

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
            const content = await fs.readFile(filePath, 'utf8');

            const lastModified = fileStats.mtime.toLocaleString();
            notes.push({
              name: path.basename(filePath),
              content,
              lastModified,
            });
          }
        }
      }
    };

    for (const folder of folders) {
      await getNotesFromFolder(folder);
    }

    console.log('Notes found:', notes);
    return notes;
  } catch (error) {
    console.error('Error getting all notes:', error);
    return [];
  }
});


ipcMain.handle('delete-folder', async (event, folderName) => {
  try {
    const folderPath = path.join(MARKY_FOLDER, folderName);
    console.log(`Attempting to delete folder at: ${folderPath}`);

    const exists = await fs.pathExists(folderPath);
    if (!exists) {
      console.log(`Folder does not exist: ${folderPath}`);
      return { success: false, error: "Folder does not exist." };
    }

    await fs.remove(folderPath); // fs-extra's remove method
    console.log(`Successfully deleted folder: ${folderPath}`);
    return { success: true, path: folderPath };
  } catch (error) {
    console.error('Error deleting folder:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-folders', async () => {
  try {
    console.log('Getting folders from:', MARKY_FOLDER);
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

    console.log('Found folders:', folders);
    return folders;
  } catch (error) {
    console.error('Error reading folders:', error);
    return [];
  }
});


ipcMain.handle('get-notes', async (event, folderName) => {
  try {
    const folderPath = path.join(MARKY_FOLDER, folderName);

    const files = await fs.readdir(folderPath);

    const notes = files.filter((fileName) => fileName.endsWith('.md'));

    console.log('Notes found:', notes);
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
    const [noteContent, stat] = await Promise.all([
      fs.readFile(notePath, { encoding: 'utf8', flag: 'r' }),
      fs.stat(notePath)
    ]);

    const lastModified = stat.mtime.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(',', '');

    return {

      content: noteContent,
      lastModified,
    };
  } catch (error) {
    console.error('Error reading note:', error)
  }
})

ipcMain.handle('write-notes', async (event, folderName, noteName, content) => {
  try {
    const folderPath = path.join(MARKY_FOLDER, folderName);
    const notePath = path.join(folderPath, noteName);

    await fs.writeFile(notePath, content, { encoding: 'utf8' });

    console.log(`Note written successfully: ${notePath}`);
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
