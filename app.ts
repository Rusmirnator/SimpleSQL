import { app, BrowserWindow } from 'electron';
import { ipcMain } from 'electron/main';
import { MainWindowRepository } from 'base/mainWindowRepository';

export class Main{
    mainWindow : BrowserWindow  | undefined;
    devToolsWindow : BrowserWindow  | undefined;

    constructor(private _mainWindow : BrowserWindow, private _devToolsWindow : BrowserWindow, private _repository : MainWindowRepository){
        console.log(_repository === null);
        _repository = new MainWindowRepository();
        console.log(_repository === null);

        app.on('ready', this.createWindow)

        app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
        })
    
        // app.on('activate', function () {
        // if (mainWindow === null){
        //     this.createWindow();
        // })
    
        // ipcMain.on('sqlQuery', async (event, query) => {
        // event.reply('sqlResponse', await msExecuteQueryAsync(query));
        // });

        _repository.registerMenuCategory('action', 'Actions');
        _repository.registerMenuItem('action', 'F1', 'F1');
        _repository.registerMenuItem('action', 'F2', 'F2');
        _repository.registerMenuItem('action', 'F3', 'F3');
        _repository.registerMenuItem('action', 'F4', 'F4');
        _repository.registerMenuItem('action', 'F5', 'F5');
        _repository.registerMenuItem('action', 'F6', 'F6');
        _repository.registerMenuItem('action', 'F7', 'F7');
        _repository.registerMenuItem('action', 'F8', 'F8');
        _repository.registerMenuItem('action', 'F9', 'F9');
        _repository.registerMenuItem('action', 'F10', 'F10');
        _repository.registerMenuItem('action', 'F11', 'F11');
        _repository.registerMenuItem('action', 'F12', 'F12');
        _repository.finalizeMenuConfiguration();
    }

    createWindow() : void {
        this.mainWindow = new BrowserWindow({
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

        this.devToolsWindow = new BrowserWindow({
        });

        // this.mainWindow.loadURL(
        //     // URL.format({
        //     // pathname: path.join(__dirname, `/dist/simplesql/index.html`),
        //     // protocol: "file:",
        //     // slashes: true
        //     // })
        // );

        this.mainWindow.webContents.setDevToolsWebContents(this.devToolsWindow.webContents);
        this.mainWindow.webContents.openDevTools({ mode: 'detach' });

        this.mainWindow.on('closed',() => {
            this.mainWindow = undefined;
        });
    }
}