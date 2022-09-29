import MainWindowRepository from './base/mainWindowRepository';
import { BrowserWindow } from "electron";
import * as url from 'url';
import * as path from 'path';

export default class Main {
    static devToolsWindow: Electron.BrowserWindow | undefined;
    static mainWindow: Electron.BrowserWindow | undefined;
    static application: Electron.App;
    static mainRepository: MainWindowRepository = new MainWindowRepository();

    constructor() {

    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {

        app.on('ready', () => Main.createWindow());

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            if (this.mainWindow === null) {
                Main.createWindow();
            }
        });
    }

    static createWindow(): void {
        Main.mainWindow = new BrowserWindow({
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

        Main.devToolsWindow = new BrowserWindow({
        });

        this.configureMenu();

        Main.mainWindow!.loadURL(
            url.format({
                pathname: path.join(__dirname, `/simplesql/index.html`),
                protocol: "file:",
                slashes: true
            })
        );

        Main.mainWindow!.webContents.setDevToolsWebContents(Main.devToolsWindow!.webContents);
        Main.mainWindow!.webContents.openDevTools({ mode: 'detach' });

        Main.mainWindow!.on('closed', () => {
            Main.mainWindow = undefined;
        });
    }

    static configureMenu() : void {
        Main.mainRepository.registerMenuCategory('action', 'Actions');
        Main.mainRepository.registerMenuItem('action', 'F1', 'F1');
        Main.mainRepository.registerMenuItem('action', 'F2', 'F2');
        Main.mainRepository.registerMenuItem('action', 'F3', 'F3');
        Main.mainRepository.registerMenuItem('action', 'F4', 'F4');
        Main.mainRepository.registerMenuItem('action', 'F5', 'F5');
        Main.mainRepository.registerMenuItem('action', 'F6', 'F6');
        Main.mainRepository.registerMenuItem('action', 'F7', 'F7');
        Main.mainRepository.registerMenuItem('action', 'F8', 'F8');
        Main.mainRepository.registerMenuItem('action', 'F9', 'F9');
        Main.mainRepository.registerMenuItem('action', 'F10', 'F10');
        Main.mainRepository.registerMenuItem('action', 'F11', 'F11');
        Main.mainRepository.registerMenuItem('action', 'F12', 'F12');
        Main.mainRepository.finalizeMenuConfiguration();
    }
}