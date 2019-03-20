require("./locale");

const electron = require('electron');
const {app, BrowserWindow} = electron;
const path = require('path');

let win;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {

  const workAreaSize = electron.screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({width: workAreaSize.width, height: workAreaSize.height, minWidth: 400, minHeight: 400, show: true});

  win.on('closed', () => {
    win = null
  });

  win.loadURL(`file://${__dirname}/static/index.html`);

});
