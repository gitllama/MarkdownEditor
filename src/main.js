const electron = require('electron');
const app = electron.app;
const path = require('path');
const url = require('url');
const ipcMain = electron.ipcMain;

let mainWindow;
let subWindow;
const configJson = require('../config.json');
const ml = require('./logic.js');


app.on('ready', ()=> {
  createWindow()
  createShortcut();
});

app.on('activate', ()=> {
  if (mainWindow === null) {
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
  const registerShortcut = configJson["shortcut"]["global"];
  for(let key in registerShortcut){
    globalShortcut.register(key, () => {
      mainWindow.webContents.send(key, registerShortcut[key]);
    })
  }
}


function createWindow () {

  createBrowserWindow('./mainWindow/index.html', configJson["window"])

  createMenu();

  createIPC();

};


function createBrowserWindow (indexpath, config) {

  mainWindow = new electron.BrowserWindow({
    title: app.getName(),
    width: config["width"],
    height: config["height"],
    //frame: false,
    //transparent: true
    kiosk : config["kiosk"] || false //全画面で専用端末画面みたいにできる
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, indexpath),
    protocol: 'file:',
    slashes: true
  }));

  // if(config["devTool"]) mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send('INIT_ASYNCLATEST', configJson);
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  return;
};

function createBrowserSubWindow (indexpath, config) {
  if(subWindow == null){
    subWindow = new electron.BrowserWindow({
      title: app.getName(),
      width: config["width"],
      height: config["height"],
      //frame: false,
      //transparent: true
      //kiosk : config["kiosk"] || false //全画面で専用端末画面みたいにできる
    });

    subWindow.loadURL(url.format({
      pathname: path.join(__dirname, indexpath),
      protocol: 'file:',
      slashes: true
    }));

    subWindow.on('closed', ()=>{
      subWindow = null
    });

    return;
  }else{
    return;
  }
};

function createMenu() {
  const Menu = electron.Menu;

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'FileOpen',
          accelerator: 'CmdOrCtrl+O',
          click () {
            let dst = electron.dialog.showOpenDialog(null, {
                properties: ['openFile'],
                title: 'Select a Markdown file',
                defaultPath: '.',
                filters: [
                    {name: 'markdown file', extensions: ['md']}
                ]
            });
            if(dst)
              mainWindow.webContents.send("READFILE_ASYNCLATEST", dst[0]);
          }
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click () { mainWindow.webContents.send("SAVEFILE_ASYNCLATEST", null); }
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click () { ml.savefileas(mainWindow) }
        },
        { type: 'separator' },
        {
          label: 'PrintPDF',
          accelerator: 'CmdOrCtrl+P',
          click () { ml.printpdf(mainWindow); }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click () { ml.exit(); }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { role: 'toggleDevTools' },
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Editor',
          type: 'checkbox',
          checked: true,
          click (i) { ml.clickViewMenu(mainWindow, i); }
        },
        {
          label: 'Split',
          type: 'checkbox',
          checked: false,
          click (i) { ml.clickViewMenu(mainWindow, i); }
        },
        {
          label: 'A4',
          type: 'checkbox',
          checked: false,
          click (i) { ml.clickViewMenu(mainWindow, i); }
        },
        { type: 'separator' },
        {
          label: 'Sub',
          click () { createBrowserSubWindow('./subWindow/index.html', configJson["window"]); }
        },
        {
          label: 'Next',
          accelerator: 'Alt+N',
          click (i) {
            if(subWindow) subWindow.webContents.send('page', 1);
          }
        },
        {
          label: 'Back',
          accelerator: 'Alt+B',
          click (i) {
            if(subWindow) subWindow.webContents.send('page', -1);
          }
        }

      ]
    }
  ]));
}



function createIPC(){

  ipcMain.on('change-text', ( event, args )=>{
    console.log(subWindow, args)
    if(subWindow)
      subWindow.webContents.send('change-text', args);
  });
  ipcMain.on('change-cursor', ( event, args )=>{
    if(subWindow)
      subWindow.webContents.send('change-cursor', args);
  });

  ipcMain.on('change-title', function (event, arg) {
    mainWindow.setTitle(`${arg} - ${app.getName()}`);
  });

  ipcMain.on('save-file', function (event, arg) {
    console.log('save-file',arg)
    if(arg != null){
      mainWindow.webContents.send("SAVEFILE_ASYNCLATEST", arg);
    }else{
      let dst = electron.dialog.showSaveDialog(null, {
        title: 'Save As',
        defaultPath: '.',
        filters: [
            {name: 'markdown file', extensions: ['md']}
        ]
      });
      if(dst !== undefined){
        mainWindow.webContents.send("SAVEFILE_ASYNCLATEST", dst);
      }
    }
  });

}

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
