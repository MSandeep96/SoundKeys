const electron = require("electron");
const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");
const {ipcMain} = require("electron");

let win;

app.on("ready", ()=>{
    //mainHandler.appReady(app.getPath('userData'));
    createWindow();
});

function createWindow(){
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({
        frame: false,
        width : width,
        height : height,
        backgroundColor: '#333333',
        title: 'Soundkeys',
        autoHideMenuBar: true
    });
    win.maximize();
    var htmlUrl = url.format({
        pathname : path.join(__dirname,"./src/index.html"),
        protocol : "file:",
        slashes : true
    });
    win.loadURL(htmlUrl);
    win.webContents.openDevTools("undocked");
}

ipcMain.on("min_win",()=>{
    win.minimize();
});

ipcMain.on("max_win",()=>{
    if(win.isMaximized()){
        win.unmaximize();
    }else{
        win.maximize();
    }
});

ipcMain.on("close_win",()=>{
    win.close();
});

// app.on('browser-window-created', mainHandler.newBrowserWindowCreated);

// TODO: Remove if not required
function clearCookies() {
    electron.session.defaultSession.clearStorageData([], function (data) {
        console.log("Wazzap");
    });
}

app.on("window-all-closed",()=>{
    // clearCookies();
    // mainHandler.appClosed();
    app.quit();
});