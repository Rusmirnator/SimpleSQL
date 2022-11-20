import { IConveyOperationResult } from 'base/interfaces/IConveyOperationResult';
import { Menu, MenuItem, BrowserWindow, app, ipcMain, IpcMainEvent, SaveDialogReturnValue, dialog } from 'electron';
import { existsSync } from 'fs';
import { join } from 'path';
import { LogLevel } from './base/enumerations';
import GeneralPurposeRepository from './base/generalPurposeRepository';
import { IAppSettings } from './base/interfaces/IAppSettings';
import Logger from './base/logger';
import { AppSettings } from './base/shared/AppSettings';
import SqlClient from './dataAccess/sqlClient';

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

            ipcMain.on('sqlBatch', async (event: IpcMainEvent, script: string) => {
                try {
                    event.reply(`sqlBatch:${this.generalRepository.toHashCode(script.length > 128 ? script.slice(0, 127) : script)}`,
                        await this.client.executeBatchAsync(script));
                } catch (error) {
                    Logger.log(error as string, LogLevel.Error);
                }
            });

            Logger.log(`Successfuly loaded application settings file from: [${filePath}]`, LogLevel.Info);
        }
    }

    private async selectPathAsync(window: Electron.BrowserWindow): Promise<SaveDialogReturnValue> {
        return await dialog.showSaveDialog(window, {
            properties: ['showOverwriteConfirmation']
        });
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

        ipcMain.on('saveScript', (event: IpcMainEvent, [path, script]) => {
            try {
                this.generalRepository.safelyWriteToFile(path, script, "utf-8");
                event.reply('scriptSaved', this.createSuccessful(path));

                Logger.log(`Successfuly saved script to file.`, LogLevel.Trace)
            } catch (error) {
                event.reply('scriptSaved', this.createUnsuccessful(1, error as string));
                Logger.log(error as string, LogLevel.Error);
            }
        });

        ipcMain.on('selectDirectory', async (event: IpcMainEvent, result: IConveyOperationResult) => {
            let window = BrowserWindow.getFocusedWindow();
            try {
                if (window) {
                    let dialogResult = await this.selectPathAsync(window);

                    if (dialogResult.canceled) {
                        result = this.createUnsuccessful(-1, "Cancelled...");

                        event.reply('directorySelected', result);
                        return;
                    }

                    result = this.createSuccessful(dialogResult.filePath!);

                    event.reply('directorySelected', result);
                }

                Logger.log(`Selected path: [${result ? result.result : "none"}]`, LogLevel.Trace)
            } catch (error) {
                result = this.createUnsuccessful(1, error as string);

                event.reply('directorySelected', result)

                Logger.log(error as string, LogLevel.Error);
            }
        });
    }

    private createSuccessful(result: Object): IConveyOperationResult {
        return {
            statusCode: 0,
            message: undefined,
            result: result
        } as IConveyOperationResult;
    }

    private createUnsuccessful(statusCode: number, message: string): IConveyOperationResult {
        return {
            statusCode: statusCode,
            message: message,
            result: undefined
        } as IConveyOperationResult;
    }
}