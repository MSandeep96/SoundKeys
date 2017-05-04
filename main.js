const electron = require("electron");
const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");
const {ipcMain,globalShortcut} = require("electron");

let win;

app.on("ready", ()=>{
    createWindow();
    registerShorts();
    electron.screen.on("display-metrics-changed",(event,display,metrics)=>{
        console.log("Here");
    });
});

app.on("window-all-closed",()=>{
    win = null;
    app.quit();
});

/**
 * Creates our main window
 */
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

/**
 * Register the global shortcuts
 */
function registerShorts(){
	globalShortcut.register("MediaNextTrack",()=>{
		win.webContents.send("shortCut","nextTrack");
	});

	globalShortcut.register("MediaPreviousTrack",()=>{
		win.webContents.send("shortCut","prevTrack");
	});

	globalShortcut.register("MediaPlayPause",()=>{
		win.webContents.send("shortCut","playTrack");
	});

	globalShortcut.register("MediaStop",()=>{
		//quit the app?
        win.close();
	});

	globalShortcut.register("CommandOrControl+3",()=>{
		//repeat toggle
		win.webContents.send("shortCut","likeTrack");
	});
	
	globalShortcut.register("CommandOrControl+4",()=>{
		//like here
		win.webContents.send("shortCut","repeatTrack");
	});

}

function positionWin(){
    var Positioner = require('electron-positioner')
    var positioner = new Positioner(win);
    pos = (process.platform==="win32") ? "bottomRight" : "topRight";
    positioner.move(pos);
}

ipcMain.on("mini_player",()=>{
    win.setSize(200,200);
});

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
