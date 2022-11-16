import MainWindowRepository from './mainWindowRepository';
import { BrowserWindow } from "electron";
import { URL } from 'whatwg-url'
import * as path from 'path';

export default class Main {
    static devToolsWindow: Electron.BrowserWindow | null;
    static mainWindow: Electron.BrowserWindow | null;
    static application: Electron.App;
    static mainRepository: MainWindowRepository = new MainWindowRepository();
    static BrowserWindow: typeof BrowserWindow;

    private static onAppReady() {
        Main.createWindow();
        Main.mainWindow!.on('closed', Main.onAppClosed);
        Main.devToolsWindow!.on('closed', Main.onAppClosed);
    }

    private static onAllWindowClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onAppClosed() {
        Main.mainWindow = null;
        Main.devToolsWindow = null;
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        Main.BrowserWindow = browserWindow;
        Main.application = app;

        Main.application.on('ready', Main.onAppReady);
        Main.application.on('window-all-closed', Main.onAllWindowClosed);
    }

    static createWindow(): void {
        Main.mainWindow = new BrowserWindow({
            minWidth: 1360,
            minHeight: 768,
            x: 0,
            y: 0,
            frame: false,
            focusable: true,
            useContentSize: true,
            autoHideMenuBar: true,
            movable: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        Main.devToolsWindow = new BrowserWindow({
            width: 560,
            height: 768,
            x: 1360,
            y: 0,
            useContentSize: true
        });

        Main.configureMenu();
        Main.initializeSettings();
        Main.mainRepository.registerListeners();
        Main.mainWindow!.loadURL(new URL(path.join('file://', __dirname, '/simplesql/index.html')).href);
        Main.mainWindow!.webContents.setDevToolsWebContents(Main.devToolsWindow!.webContents);
        Main.mainWindow!.webContents.openDevTools({ mode: 'detach' });
    }

    static configureMenu(): void {
        Main.mainRepository.registerMenuCategory('action', 'Actions');
        Main.mainRepository.registerMenuItem('action', 'F1', 'F1');
        Main.mainRepository.registerMenuItem('action', 'F2', 'F2');
        Main.mainRepository.registerMenuItem('action', 'F3', 'F3');
        Main.mainRepository.registerMenuItem('action', 'F4', 'F4');
        Main.mainRepository.registerMenuItem('action', 'Execute', 'F5');
        Main.mainRepository.registerMenuItem('action', 'F6', 'F6');
        Main.mainRepository.registerMenuItem('action', 'F7', 'F7');
        Main.mainRepository.registerMenuItem('action', 'F8', 'F8');
        Main.mainRepository.registerMenuItem('action', 'F9', 'F9');
        Main.mainRepository.registerMenuItem('action', 'F10', 'F10');
        Main.mainRepository.registerMenuItem('action', 'F11', 'F11');
        Main.mainRepository.registerMenuItem('action', 'F12', 'F12');
        Main.mainRepository.registerMenuItem('action', 'Show/Hide grid', 'CmdOrCtrl+R');
        Main.mainRepository.registerMenuItem('action', 'Save script to file', 'CmdOrCtrl+S');
        Main.mainRepository.registerMenuCategory('dev', 'Development');
        Main.mainRepository.registerMenuItem('dev', 'Reload', 'CmdOrCtrl+Shift+R');
        Main.mainRepository.finalizeMenuConfiguration();
    }

    static initializeSettings(): void {
        try {
            Main.mainRepository.initializeSettings();

        } catch (error) {
            console.log(error);
        }
    }
}