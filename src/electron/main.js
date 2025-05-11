import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs-extra';
import os from 'os';
import matter from 'gray-matter';
import Store from 'electron-store'
import MarkdownIt from 'markdown-it';
import mdKatex from 'markdown-it-katex';
import taskLists from 'markdown-it-task-lists';
import hljs from 'highlight.js';
import katex from 'katex';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MARKY_FOLDER = path.join(os.homedir(), 'marky');
const store = new Store();
let mainWindow;

function createWindow() {
  const preloadPath = path.resolve(__dirname, 'preload.js');
  console.log('Looking for preload script at:', preloadPath);
  console.log('File exists:', fs.existsSync(preloadPath));

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    icon: path.join(process.cwd(), 'public', 'logo.ico'),
    titleBarStyle: 'hidden',
    frame: false,
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

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
  console.log('Minimized');
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
  console.log('closed');
});

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
    const files = await fs.readdir(MARKY_FOLDER);

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

function preprocessKaTeX(md) {
  md = md.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
    try {
      return katex.renderToString(expr, { displayMode: true, throwOnError: false });
    } catch (e) {
      return `<pre>${expr}</pre>`;
    }
  });

  md = md.replace(/(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)/g, (_, expr) => {
    const trimmed = expr.trim();

    if (/^[.]+$/.test(trimmed)) {
      return `<code>${trimmed}</code>`;
    }

    try {
      return katex.renderToString(expr, { displayMode: false, throwOnError: false });
    } catch (e) {
      return `<code>${trimmed}</code>`;
    }
  });
  return md;
}

function processMermaidBlocks(html) {
  return html.replace(/<pre><code class="language-mermaid">([\s\S]+?)<\/code><\/pre>/g,
    (_, content) => {
      const escapedContent = content
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      return `<div class="mermaid">${escapedContent}</div>`;
    }
  );
}

async function generatePdf(htmlContent, fileName) {
  try {
    const exportWin = new BrowserWindow({
      width: 1000,
      height: 800,
      show: false, // Keep invisible
      webPreferences: {
        offscreen: true,
        javascript: true,
        webSecurity: false,
        nodeIntegration: false,
        contextIsolation: true,
      }
    });

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Markdown PDF</title>
       
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" crossorigin="anonymous">
       
        <script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js"></script>
       
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark-dimmed.min.css">
       
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 2em;
            line-height: 1.5;
            color: #333;
          }
         
          h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: 600;
          }
         
          h1 { font-size: 2em; }
          h2 { font-size: 1.5em; }
          h3 { font-size: 1.3em; }
         
          pre {
            background: #f6f8fa;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
          }
         
          code {
            font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
            background: #f6f8fa;
            padding: 2px 4px;
            border-radius: 3px;
          }
         
          pre code {
            padding: 0;
            background: transparent;
          }
         
          blockquote {
            border-left: 4px solid #ddd;
            margin-left: 0;
            padding-left: 1em;
            color: #666;
          }
         
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
          }
         
          table, th, td {
            border: 1px solid #ddd;
          }
         
          th, td {
            padding: 8px 12px;
            text-align: left;
          }
         
          th {
            background-color: #f6f8fa;
          }
         
          .mermaid {
            text-align: center;
            margin: 1.5em 0;
            background-color: white;
            padding: 10px;
            border-radius: 6px;
          }
         
          img {
            max-width: 100%;
            height: auto;
          }
         
          /* KaTeX styles */
 .katex-display {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 6px;
      overflow-x: auto;
      display: block;
      margin-top: 1rem;
      margin-bottom: 1rem;
      text-align: center;
    }
    .katex {
      display: inline-block;
      margin: 0 0.2em;
      text-rendering: auto;
      font-size: 1em;
    }
    .katex .base {
      margin-top: 2px;
    }
        </style>
      </head>
      <body class="markdown-body">
        ${htmlContent}
        
        <script>
          // Configure Mermaid
          mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'system-ui, sans-serif'
          });
          
          // Track rendering status
          let renderingComplete = false;

          // Function to notify when rendering is complete
          function notifyRendered() {
            renderingComplete = true;
            if (window.electronAPI?.send) {
              window.electronAPI.send('RENDERING_COMPLETE');
            } else {
              window.postMessage('RENDERING_COMPLETE', '*');
            }
          }

          // Handle both native mermaid divs and converted code blocks
          function processMermaidDiagrams() {
            // Run mermaid on all .mermaid divs
            try {
              mermaid.run().then(() => {
                // Add a delay to ensure rendering completes
                setTimeout(notifyRendered, 1000);
              }).catch(err => {
                console.error('Mermaid rendering error:', err);
                notifyRendered();
              });
            } catch (err) {
              console.error('Mermaid processing error:', err);
              notifyRendered();
            }
          }

          // Handle page load
          window.addEventListener('DOMContentLoaded', () => {
            // Check if we have any mermaid diagrams
            const hasMermaidDiagrams = document.querySelectorAll('.mermaid').length > 0;
            
            if (hasMermaidDiagrams) {
              processMermaidDiagrams();
            } else {
              // No mermaid diagrams, complete immediately
              setTimeout(notifyRendered, 100);
            }
          });
          
          // Handle window messages (fallback)
          window.addEventListener('message', (event) => {
            if (event.data === 'RENDERING_COMPLETE') {
              if (window.electronAPI?.send) {
                window.electronAPI.send('RENDERING_COMPLETE');
              } else {
                console.log('Rendering complete signal received');
              }
            }
          });
        </script>
      </body>
      </html>
    `;

    exportWin.webContents.on('console-message', (event, level, message) => {
      console.log(`Renderer log [${level}]: ${message}`);
    });

    await exportWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(fullHtml)}`);

    await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.log('PDF rendering timeout reached (8s), proceeding anyway');
        resolve();
      }, 8000);

      const handleMessage = (event, channel) => {
        if (channel === 'RENDERING_COMPLETE') {
          console.log('Received rendering complete signal');
          clearTimeout(timeout);
          resolve();
          exportWin.webContents.removeListener('ipc-message', handleMessage);
        }
      };

      exportWin.webContents.on('ipc-message', handleMessage);

      exportWin.webContents.on('did-finish-load', () => {
        exportWin.webContents.executeJavaScript(`
          // Define electronAPI if it doesn't exist (for older Electron versions)
          if (!window.electronAPI) {
            window.electronAPI = {
              send: (channel, data) => {
                if (typeof window.ipcRenderer !== 'undefined') {
                  window.ipcRenderer.send(channel, data);
                } else {
                  console.log('IPC not available, using postMessage');
                  window.postMessage(channel, '*');
                }
              }
            };
          }
        `);
      });
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    const defaultFileName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    const saveResult = await dialog.showSaveDialog({
      defaultPath: defaultFileName,
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
    });

    const filePath = saveResult.filePath;
    if (filePath) {
      const pdfBuffer = await exportWin.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
        landscape: false,
        displayHeaderFooter: false,
        margins: {
          marginType: 'default'
        },
        preferCSSPageSize: false
      });

      await fs.writeFile(filePath, pdfBuffer);
      console.log(`PDF saved successfully to: ${filePath}`);
      return { success: true, path: filePath };
    } else {
      console.log('PDF export cancelled by user');
      return { success: false, cancelled: true };
    }

    exportWin.destroy();

  } catch (err) {
    console.error("PDF export failed:", err);
    return { success: false, error: err.message };
  }
}

ipcMain.on('export-to-pdf', async (event, data) => {
  try {
    console.log("Starting enhanced PDF export with data:", typeof data, Object.keys(data));

    const content = data.content;
    const fileName = (typeof data.fileName === 'string' && data.fileName)
      ? data.fileName
      : 'document.pdf';

    const md = new MarkdownIt({
      html: true,
      highlight: function(str, lang) {
        if (lang === 'mermaid') return str;

        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value;
          } catch (err) {
            console.error('Highlight error:', err);
          }
        }
        return '';
      }
    }).use(mdKatex, {
      throwOnError: false,
      strict: false,
      output: 'html',
    }).use(taskLists, { enabled: true, label: true });

    let htmlContent;
    if (content && typeof content === 'object' && content.content) {
      const { content: mdContent } = matter(content.content);
      const preprocessedContent = preprocessKaTeX(mdContent);
      htmlContent = md.render(preprocessedContent);

    } else if (typeof content === 'string') {
      const preprocessedContent = preprocessKaTeX(content);
      htmlContent = md.render(preprocessedContent);
    } else {
      htmlContent = '<p>No content to export</p>';
    }

    // Process mermaid code blocks
    htmlContent = processMermaidBlocks(htmlContent);

    const result = await generatePdf(htmlContent, fileName);
    event.sender.send('pdf-export-complete', result);

  } catch (error) {
    console.error("Error in ipcMain handler:", error);
    event.sender.send('pdf-export-complete', { success: false, error: error.message });
    dialog.showErrorBox('Error during PDF export', error.message);
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
