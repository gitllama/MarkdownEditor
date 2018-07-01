const {app,ipcMain} = require('electron');

exports.createIPC = function(win){

  // ipcMain.on('sync-html', ( event, args )=>{
  //   if(win.subWindow())
  //     win.subWindow().webContents.send('sync-html', args);
  // });
  //
  ipcMain.on('change-text', (event, args) => {
    //win.mainWindow().setTitle(`${args} - ${app.getName()}`);
    win.sendAll('TEXT_CHANGE', args)
  });

}
