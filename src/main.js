const electron = require('electron');
const app = electron.app;
const path = require('path');
const url = require('url');
const ipcMain = electron.ipcMain;

const ml = require('./logic.js');
const win = require('./windowManager.js');
const ipc = require('./ipc.js');
const menu = require('./menu.js');

app.on('ready', ()=> {
  createWindow()
  createShortcut();
});

app.on('activate', ()=> {
  if (win.mainWindow === null) {
    createWindow()
  }
});

app.on('window-all-closed', ()=> {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

process.on('uncaughtException', (error)=> {
    console.error(error);
});


function createShortcut(){
  const globalShortcut = electron.globalShortcut;
  const registerShortcut = win.getConfig()["shortcut"]["global"];
  for(let key in registerShortcut){
    globalShortcut.register(key, () => {
      win.mainWindow().webContents.send(key, registerShortcut[key]);
    })
  }
}


function createWindow () {

  win.createBrowserWindow(
    app.getName(),
    './render/index.html',
    win.getConfig()
  )

  menu.createMenu();

  ipc.createIPC();

};



// const clipboard = electron.clipboard;

function createByShell(){

  // const shell = electron.shell;
  // shell.openExternal('https://github.com');
  // shell.moveItemToTrash('./3rd.html');

}

function createRemote(){
  //右クリックメニュー
  // const remote = electron.remote;
  // const Menu = remote.Menu;
  // const MenuItem = remote.MenuItem;
  //
  // let template = [
  //   { label: 'Menu-1', click: function() { console.log('item 1 clicked'); } },
  //   { type: 'separator' },
  //   { label: 'Menu-2', type: 'checkbox', checked: true},
  //   { label: 'Menu-3', submenu:[
  //   {label: 'Sub-Menu-1', accelerator: 'CmdOrCtrl+M'}]}
  // ];
  //
  // var menu = Menu.buildFromTemplate(template);
  //
  // menu.append(new MenuItem({ type: 'separator' }));
  // menu.append(new MenuItem({ label: 'NewMenu' }));
  //
  // window.addEventListener('contextmenu', function (e) {
  //   e.preventDefault();
  //   menu.popup(remote.getCurrentWindow());
  // }, false);
}

function createTray(){
  //メニューバー
  // const Menu = electron.Menu;
  // const Tray = electron.Tray;
  // app.on('ready', function() {
  //     appIcon = new Tray('./tri.png');
  //     var contextMenu = Menu.buildFromTemplate([
  //         { label: 'Item1', type: 'radio' },
  //         { label: 'Item2', type: 'radio' },
  //         { label: 'Item3', type: 'radio', checked: true },
  //         { label: 'Item4', type: 'radio' }
  //     ]);
  //     appIcon.setToolTip('This is my application.');
  //     appIcon.setContextMenu(contextMenu);
  // }

}
