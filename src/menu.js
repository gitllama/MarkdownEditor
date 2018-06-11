const electron = require('electron');
const win = require('./windowManager.js');

exports.createMenu = function() {
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
              win.mainWindow().webContents.send("READFILE_ASYNCLATEST", dst[0]);
          }
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click () { win.mainWindow().webContents.send("SAVEFILE_ASYNCLATEST", null); }
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click () { ml.savefileas(win.mainWindow) }
        },
        { type: 'separator' },
        {
          label: 'PrintPDF',
          accelerator: 'CmdOrCtrl+P',
          click () { ml.printpdf(win.mainWindow); }
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
          click (i) { clickViewMenu(win.mainWindow(), i); }
        },
        {
          label: 'Split',
          type: 'checkbox',
          checked: false,
          click (i) { clickViewMenu(win.mainWindow(), i); }
        },
        {
          label: 'Preview',
          type: 'checkbox',
          checked: false,
          click (i) { clickViewMenu(win.mainWindow(), i); }
        },
        { type: 'separator' },
        {
          label: 'Open SubWindow',
          click () { win.createBrowserSubWindow("Preview", './render/index_sub.html', win.getConfig()); }
        }
      ]
    },
    {
      label: 'Preview',
      submenu: [
        {
          label: 'Default',
          type: 'checkbox',
          checked: true,
          click (i) { clickPreviewMenu(win.mainWindow(), i); }
        },
        {
          label: 'A4',
          type: 'checkbox',
          checked: false,
          click (i) { clickPreviewMenu(win.mainWindow(), i); }
        },
        {
          label: 'Slide',
          type: 'checkbox',
          checked: false,
          click (i) { clickPreviewMenu(win.mainWindow(), i); }
        },
        { type: 'separator' },
        {
          label: 'Next',
          accelerator: 'Alt+N',
          click (i) {
            if(win.subWindow()) win.subWindow().webContents.send('page', 1);
          }
        },
        {
          label: 'Back',
          accelerator: 'Alt+B',
          click (i) {
            if(win.subWindow()) win.subWindow().webContents.send('page', -1);
          }
        }
      ]
    },
  ]));
}


function clickViewMenu(mainWindow, item){
  const menu = electron.Menu.getApplicationMenu();
  menu.items["View"]
  let result = menu.items.filter((i)=>{
    return i.label == 'View';
  })
  result[0].submenu.items.forEach((i)=>{i.checked = false});
  item.checked = true;
  win.sendMain("view-change", item.label);
}

function clickPreviewMenu(mainWindow, item){
  const menu = electron.Menu.getApplicationMenu();
  menu.items["Preview"]
  let result = menu.items.filter((i)=>{
    return i.label == 'Preview';
  })
  result[0].submenu.items.forEach((i)=>{i.checked = false});
  item.checked = true;
  win.sendAll("preview-change", item.label);
}
