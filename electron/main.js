const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // Optional, but good practice
    },
    title: "SafetyGuard Admin"
  });

  // In production, load the built index.html
  // In development, you might load localhost:5173
  const isDev = !app.isPackaged;
  
  if (isDev) {
      win.loadURL('http://localhost:5173');
      win.webContents.openDevTools();
  } else {
      // Points to the Vite build output (dist/index.html)
      // Ensure Vite config has base: './'
      win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});