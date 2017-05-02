const electron = require("electron");
const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");
const {ipcMain} = require("electron");
// const mainHandler=require('./main_proc');

app.on("ready", ()=>{
    //mainHandler.appReady(app.getPath('userData'));
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({ width, height, backgroundColor: '#FF6B00', title: 'Soundkeys', autoHideMenuBar: true });
    win.maximize();
    var htmlUrl = url.format({
        pathname : path.join(__dirname,"./src/index.html"),
        protocol : "file:",
        slashes : true
    });
    win.loadURL(htmlUrl);
    win.webContents.openDevTools("undocked");
    ipcMain.on("got_data",(event,arg)=>{
        console.log(arg + "idhar ");
        event.sender.send("alright","achi baath hein");
        event.sender.send("webu","milri kya?");
    })
});

// app.on('browser-window-created', mainHandler.newBrowserWindowCreated);

app.on("window-all-closed",()=>{
    // mainHandler.appClosed();
    app.quit();
});