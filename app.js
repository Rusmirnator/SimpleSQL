const { app, BrowserWindow } = require('electron')
const url = require("url");
const path = require("path");
const { ipcMain } = require('electron/main');
const { loadSettings: msLoadSettings, executeQueryAsync: msExecuteQueryAsync } = require('./base/mssqlClient.js');
const { loadSettings: pgLoadSettings, executeQueryAsync: pgExecuteQueryAsync } = require('./base/pgsqlClient.js');
const { registerMenuCategory, registerMenuItem, finalizeMenuConfiguration } = require('./base/mainWindowRepository.js');

let mainWindow;
let devToolsWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 1360,
    minHeight: 768,
    x: 100,
    y: 100,
    frame: true,
    useContentSize: true,
    autoHideMenuBar: true,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  devToolsWindow = new BrowserWindow({
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/simplesql/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.webContents.setDevToolsWebContents(devToolsWindow.webContents);
  mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

registerMenuCategory('action', 'Actions');
registerMenuItem('action', 'F1', 'F1');
registerMenuItem('action', 'F2', 'F2');
registerMenuItem('action', 'F3', 'F3');
registerMenuItem('action', 'F4', 'F4');
registerMenuItem('action', 'F5', 'F5');
registerMenuItem('action', 'F6', 'F6');
registerMenuItem('action', 'F7', 'F7');
registerMenuItem('action', 'F8', 'F8');
registerMenuItem('action', 'F9', 'F9');
registerMenuItem('action', 'F10', 'F10');
registerMenuItem('action', 'F11', 'F11');
registerMenuItem('action', 'F12', 'F12');
finalizeMenuConfiguration();

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

ipcMain.on('sqlQuery', async (event, query) => {
  event.reply('sqlResponse', await msExecuteQueryAsync(query));
});
