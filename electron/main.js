const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: "SafeWatch AI - Smart Safety & Reward Management",
    icon: path.join(__dirname, '../public/favicon.ico'), // Ensure you have an icon
    autoHideMenuBar: true // Modern look
  });

  const isDev = !app.isPackaged;
  
  if (isDev) {
      // In development, load from Vite dev server
      win.loadURL('http://localhost:5173');
      // Open DevTools for debugging
      // win.webContents.openDevTools(); 
  } else {
      // In production, load the built index.html
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