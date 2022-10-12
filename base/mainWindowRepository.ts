import { Menu, MenuItem, BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron';
import { existsSync } from 'fs';
import { join } from 'path';
import { LogLevel } from './enumerations';
import GeneralPurposeRepository from './generalPurposeRepository';
import { IAppSettings } from './interfaces/IAppSettings';
import Logger from './logger';
import { AppSettings } from './shared/AppSettings';
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

        if (!existsSync(filePath)) {
            ipcMain.on("startup", (event: IpcMainEvent) => {
                event.reply("configurationRequired", (filePath));
            });
            ipcMain.on("configurationProvided", (event: IpcMainEvent, createdSettings: IAppSettings) => {
                this.generalRepository.safelyWriteToFile(filePath, JSON.stringify(createdSettings, null, 4));
                this.loadConfigFile(filePath);
            });
            Logger.log(`Couldn't locate application settings file at: [${filePath}]`, LogLevel.Warning);
        }

        this.loadConfigFile(filePath);
    }

    emitKeyPressedEvent(keyGesture: string) {
        let win = BrowserWindow.getFocusedWindow();
        win!.webContents.send('keyPressed', keyGesture);

        if (keyGesture === 'CmdOrCtrl+Shift+R') {
            console.log("Window reloaded");
            this.reloadWindow();
        }
    }

    reloadWindow(): void {
        let win = BrowserWindow.getFocusedWindow();

        win?.reload();
    }

    private loadConfigFile(filePath: string): void {
        if (existsSync(filePath)) {
            let configFile = this.generalRepository.safelyReadFile(filePath, 'utf-8');

            try {
                this.settings.consume(JSON.parse(configFile!));
            } catch (error) {
                Logger.log(error as string, LogLevel.Error);
            }

            let connectionString = this.settings.getSection("Connection:PGSQL").getValue<string>("DatabaseURL");
            let ssl = this.settings.getSection("Connection:PGSQL").getValue<string>("SSL");

            this.client.configureConnection(connectionString);

            ipcMain.on('sqlQuery', async (event: IpcMainEvent, query: string) => {
                try {
                    event.reply(`sqlQuery:${this.generalRepository.toHashCode(query)}`, await this.client.executeQueryAsync(query));
                } catch (error) {
                    Logger.log(error as string, LogLevel.Error);
                }
            });

            Logger.log(`Successfuly loaded application settings file from: [${filePath}]`, LogLevel.Info);
        }
    }

    registerListeners(): void {
        ipcMain.on('log', (event: IpcMainEvent, content) => {
            try {
                event.reply('log', Logger.log(content));
            } catch (error) {
                Logger.log(error as string, LogLevel.Error);
            }
        });

        ipcMain.on('log:warning', (event: IpcMainEvent, content) => {
            try {
                event.reply('log', Logger.log(content, LogLevel.Warning));
            } catch (error) {
                Logger.log(error as string, LogLevel.Error);
            }
        });

        ipcMain.on('log:error', (event: IpcMainEvent, content) => {
            try {
                event.reply('log', Logger.log(content, LogLevel.Error));
            } catch (error) {
                Logger.log(error as string, LogLevel.Error);
            }
        });

        ipcMain.on('log:debug', (event: IpcMainEvent, content) => {
            try {
                event.reply('log', Logger.log(content, LogLevel.Debug));
            } catch (error) {
                Logger.log(error as string, LogLevel.Error);
            }
        });

        ipcMain.on('log:trace', (event: IpcMainEvent, content) => {
            try {
                event.reply('log', Logger.log(content, LogLevel.Trace));
            } catch (error) {
                Logger.log(error as string, LogLevel.Error);
            }
        });
    }
}