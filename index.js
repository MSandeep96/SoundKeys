const {app, BrowserWindow} = require('electron');
const electron = require('electron');

var shortCutHandler = require('app_shortcuts');

let win;
let child;

app.on("ready", createWindow);

function createWindow() {
    win = new BrowserWindow({ backgroundColor: '#FF6B00' });
    win.maximize();
    win.loadURL('https://www.soungdcloud.com');
    shortCutHandler.init(win);
}


app.on("window-all-closed", () => {
    shortCutHandler.dest();
    app.quit();
});

