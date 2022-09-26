const { Menu, MenuItem, BrowserWindow } = require('electron');

const menu = new Menu()

function registerMenuCategory(id, label) {

    if (menu.items.every((menuItem) => menuItem.id !== id)) {
        menu.append(new MenuItem({
            id: id,
            label: label,
            submenu: []
        }));
        return;
    }
    console.log(`Cannot add ${id}, ${label}, ${type} - MenuItem ${id} already exists!`);
}

function registerMenuItem(id, label, keyGesture) {

    let menuItem = menu.getMenuItemById(id);

    if (menuItem !== null) {
        menuItem.submenu.append(new MenuItem({
            id: id + label,
            label: label,
            role: 'none',
            accelerator: keyGesture,
            click: () => { emitKeyPressedEvent(keyGesture); }
        }));
        return;
    }
    console.log(`Cannot add to ${id} - MenuItem ${id} does not exist!`);
}

function finalizeMenuConfiguration() {
    Menu.setApplicationMenu(menu);
}

function emitKeyPressedEvent(keyGesture) {
    let win = BrowserWindow.getFocusedWindow();
    win.webContents.send('keyPressed', keyGesture);
}


module.exports = { registerMenuCategory, registerMenuItem, finalizeMenuConfiguration };