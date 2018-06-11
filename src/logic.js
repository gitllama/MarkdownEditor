const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const fs = require('fs');


exports.exit = function() {
  app.quit();
}

exports.printpdf = function(mainWindow) {
  mainWindow.webContents.printToPDF({
    marginsType : 1, // Uses 0 for default margin, 1 for no margin, and 2 for minimum margin.
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
