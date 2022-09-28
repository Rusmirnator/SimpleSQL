import { Menu, MenuItem, BrowserWindow } from 'electron';

export default class MainWindowRepository{
     menu : Menu = new Menu();

    constructor() {}

    registerMenuCategory(id : string, label : string) {

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
        console.log(`Cannot add ${id}, ${label} - MenuItem ${id} already exists!`);
    }
    
    registerMenuItem(id : string, label : string, keyGesture : string) {
    
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
        console.log(`Cannot add to ${id} - MenuItem ${id} does not exist!`);
    }
    
    finalizeMenuConfiguration() {
        Menu.setApplicationMenu(this.menu);
    }
    
    emitKeyPressedEvent(keyGesture : string) {
        let win = BrowserWindow.getFocusedWindow();
        win!.webContents.send('keyPressed', keyGesture);
    }
}