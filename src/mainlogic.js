const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const fs = require('fs');

exports.registeripc = function(mainWindow) {

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


exports.exit = function() {
  app.quit();
}


exports.printpdf = function(mainWindow) {
  mainWindow.webContents.printToPDF({
    marginsType : 0, // for no margin
    printBackground: true,
    printSelectionOnly: false,
    pageSize: 'A4',
    //landscape : false
  }, (error, data) => {
    if (error) throw error
    fs.writeFile('print.pdf', data, (error) => {
      if (error) throw error
      // shell.openExternal('file://' + pdfPath) // 書き込みの確認
      // event.sender.send('wrote-pdf', pdfPath) // 報告
      console.log('Write PDF successfully.')
    })
  });
}


exports.clickViewMenu = function(mainWindow, item){
  const menu = electron.Menu.getApplicationMenu();
  menu.items["View"]
  let result = menu.items.filter((i)=>{
    return i.label == 'View';
  })
  result[0].submenu.items.forEach((i)=>{i.checked = false});
  item.checked = true;
  mainWindow.webContents.send("VIEW_CHANGE", item.label);
}


exports.savefileas = function(mainWindow){
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
