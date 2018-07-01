const {app, ipcMain, BrowserWindow} = require('electron');

const path = require('path');
const url = require('url');
const fs = require('fs');

const ipc = require('./ipc.js');
const menu = require('./menu.js');

// const configJson = require('../../config.json');

class WindowManager {
  constructor(path) {
    this.windowDocker = {}
    this.configJson = JSON.parse(fs.readFileSync(path.join(__dirname, path)));
  }
  mainWindow() {
    return this.windowDocker["main"];
  }
  createBrowser(type, title) {
    if(this.windowDocker[type] != null) return;

    let _config = Object.assign({
      title: title,
      webPreferences : {
        additionalArguments : [type]
      }
    }, configJson['window']);

    this.windowDocker[type] = new BrowserWindow(_config);
    this.windowDocker[type].loadURL(url.format({
      pathname: path.join(__dirname, '../index.html'),
      protocol: 'file:',
      slashes: true
    }));

    this.windowDocker[type].webContents.on('did-finish-load',()=>{
      //this.windowDocker[type].webContents.send('INIT_ASYNCLATEST', config);
    });
    this.windowDocker[type].on('closed', ()=>{
      this.windowDocker[type] = null
      delete this.windowDocker[type];
    });

    if(type == 'main'){

    }else{

    }
  }
  sendAll(name, arg){
    console.log(name, arg)
    Object.keys(this.windowDocker).forEach((key)=>{
      this.windowDocker[key].webContents.send(name, arg);
    });
  }
  sendMain(name, arg){
    this.windowDocker['main'].webContents.send(name, arg);
  }
}
const win = new WindowManager('../config.json');

app.on('ready', ()=> {
  createWindow()
  //createShortcut();
});

app.on('activate', ()=> {
  if (win.mainWindow() === null) {
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

function createWindow () {
  win.createBrowser('main', app.getName())
  menu.createMenu(win);
  ipc.createIPC(win);
};
