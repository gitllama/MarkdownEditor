const electron = require('electron');
const app = electron.app;
const path = require('path');
const url = require('url');

let mainWindow;
const configJson = require('../config.json');
const ml = require('./mainlogic.js');


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

  mainWindow = createBrowserWindow('./mainWindow/index.html', configJson["window"])

  createMenu();

  createIPC();

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send('INIT_ASYNCLATEST', configJson);
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  });

};


function createBrowserWindow (indexpath, config) {

  let obj = new electron.BrowserWindow({
    title: app.getName(),
    width: config["width"],
    height: config["height"],
    //frame: false,
    //transparent: true
    kiosk : config["kiosk"] || false //全画面で専用端末画面みたいにできる
  });

  obj.loadURL(url.format({
    pathname: path.join(__dirname, indexpath),
    protocol: 'file:',
    slashes: true
  }));

  if(config["devTool"]) obj.webContents.openDevTools();

  return obj;
};

function createMenu() {
  const Menu = electron.Menu;

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'FileOpen',
          accelerator: 'Ctrl+O',
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
          accelerator: 'Ctrl+S',
          click () { mainWindow.webContents.send("SAVEFILE_ASYNCLATEST", null); }
        },
        {
          label: 'Save As...',
          accelerator: 'Ctrl+Shift+S',
          click () { ml.savefileas(mainWindow) }
        },
        { type: 'separator' },
        {
          label: 'PrintPDF',
          accelerator: 'Ctrl+P',
          click () { ml.printpdf(mainWindow); }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'Ctrl+Q',
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
        }

      ]
    }
  ]));
}



function createIPC(){
  ml.registeripc( mainWindow);
  // electron.ipcMain.on('async', function( event, args ){
  //   mainWindow.webContents.send('return', configJson);
  // });
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
