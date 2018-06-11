const electron = require('electron');
const ipcMain = electron.ipcMain;

const win = require('./windowManager.js');

exports.createIPC = function(){
  ipcMain.on('sync-html', ( event, args )=>{
    // console.log(subWindow, args)
    if(win.subWindow())
      win.subWindow().webContents.send('sync-html', args);
  });
  // ipcMain.on('change-cursor', ( event, args )=>{
  //   if(subWindow)
  //     subWindow.webContents.send('change-cursor', args);
  // });
  //
  // ipcMain.on('change-title', function (event, arg) {
  //   mainWindow.setTitle(`${arg} - ${app.getName()}`);
  // });
  //
  // ipcMain.on('save-file', function (event, arg) {
  //   console.log('save-file',arg)
  //   if(arg != null){
  //     mainWindow.webContents.send("SAVEFILE_ASYNCLATEST", arg);
  //   }else{
  //     let dst = electron.dialog.showSaveDialog(null, {
  //       title: 'Save As',
  //       defaultPath: '.',
  //       filters: [
  //           {name: 'markdown file', extensions: ['md']}
  //       ]
  //     });
  //     if(dst !== undefined){
  //       mainWindow.webContents.send("SAVEFILE_ASYNCLATEST", dst);
  //     }
  //   }
  // });
}
