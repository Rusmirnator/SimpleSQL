import { Menu, MenuItem, BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron';
import { existsSync } from 'fs';
import { join } from 'path';
import { LogLevel } from './enumerations';
import GeneralPurposeRepository from './generalPurposeRepository';
import Logger from './logger';
import AppSettings from './shared/AppSettings';
import SqlClient from './sqlClient';

export default class MainWindowRepository {
    private settings: AppSettings;
    private homeDirectory: string | undefined;
    private generalRepository = new GeneralPurposeRepository();
    private client: SqlClient = new SqlClient();

    menu: Menu = new Menu();

    constructor() {
        this.settings = new AppSettings();
        this.homeDirectory = app.getPath("appData");
    }

    registerMenuCategory(id: string, label: string) {
        if (this.menu.items.every((menuItem) => menuItem.id !== id)) {
            this.menu.append(
                new MenuItem(
                    {
                        id: id,
                        label: label,
                        submenu: []
                    }));
            return;
        }
        Logger.log(`Cannot add ${id}, ${label} - MenuItem ${id} already exists!`, LogLevel.Warning);
    }

    registerMenuItem(id: string, label: string, keyGesture: string) {
        let menuItem = this.menu.getMenuItemById(id);

        if (menuItem !== null) {
            menuItem!.submenu!.append(
                new MenuItem(
                    {
                        id: id + label,
                        label: label,
                        accelerator: keyGesture,
                        click: () => { this.emitKeyPressedEvent(keyGesture); }
                    }));
            return;
        }
        Logger.log(`Cannot add to ${id} - MenuItem ${id} does not exist!`, LogLevel.Warning);
    }

    finalizeMenuConfiguration() {
        Menu.setApplicationMenu(this.menu);
    }

    initializeSettings(): void {
        let filePath = join(this.homeDirectory!, 'simplesql', 'appsettings.json');
        let configFile = undefined;

        if (existsSync(filePath)) {
            configFile = this.generalRepository.safelyReadFile(filePath, 'utf-8');

            try {
                this.settings.consume(JSON.parse(configFile!));
            } catch (error) {
                Logger.log(error as string, LogLevel.Error);
            }

            this.client.configureConnection(this.settings.getSection("Connection:PGSQL").getValue<string>("DatabaseURL"));

            ipcMain.on('sqlQuery', async (event: IpcMainEvent, query: string) => {
                try {
                    event.reply('sqlQuery', await this.client.executeQueryAsync(query));
                } catch (error) {
                    Logger.log(error as string, LogLevel.Error);
                }
            });
        }
    }

    emitKeyPressedEvent(keyGesture: string) {
        let win = BrowserWindow.getFocusedWindow();
        win!.webContents.send('keyPressed', keyGesture);
    }
}