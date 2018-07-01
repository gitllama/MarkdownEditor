const {app, Menu} = require('electron');

exports.createMenu = function(win) {

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click () { app.quit(); }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Open SubWindow',
          click () { win.createBrowser("sub", 'title'); }
        },
        { role: 'toggleDevTools' }   //Shift+Ctrl+I
      ]
    }
  ]));
}
