const electron = require("electron");
const { app, BrowserWindow ,Tray} = require("electron");
const path = require("path");
const url = require("url");
const { ipcMain, globalShortcut } = require("electron");

let win;
let tray;

app.on("ready", () => {
	createWindow();
	registerShorts();
});

app.on("window-all-closed", () => {
	win = null;
	app.quit();
});

/**
 * Creates our main window
 */
function createWindow() {
	const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

	win = new BrowserWindow({
		frame: false,
		width: width,
		height: height,
		icon: "./icon.ico",
		backgroundColor: "#333333",
		title: "Soundkeys",
		autoHideMenuBar: true
	});

	win.maximize();

	var htmlUrl = url.format({
		pathname: path.join(__dirname, "./src/index.html"),
		protocol: "file:",
		slashes: true
	});

	win.loadURL(htmlUrl);
	win.webContents.on("new-window", function (event, url, frameName, disposition, windowOptions) {
		windowOptions["node-integration"] = false;
	});
	win.webContents.openDevTools("undocked");
}

/**
 * Register the global shortcuts
 */
function registerShorts() {
	globalShortcut.register("MediaNextTrack", () => {
		win.webContents.send("shortCut", "nextClicked");
	});

	globalShortcut.register("MediaPreviousTrack", () => {
		win.webContents.send("shortCut", "prevClicked");
	});

	globalShortcut.register("MediaPlayPause", () => {
		win.webContents.send("shortCut", "playClicked");
	});

	globalShortcut.register("MediaStop", () => {
		//quit the app?
		win.close();
	});

	globalShortcut.register("CommandOrControl+3", () => {
		//repeat toggle
		win.webContents.send("shortCut", "likeClicked");
	});

	globalShortcut.register("CommandOrControl+4", () => {
		//like here
		win.webContents.send("shortCut", "repeatClicked");
	});

}

function positionWin() {
	var Positioner = require("electron-positioner");
	var positioner = new Positioner(win);
	var pos = (process.platform === "win32") ? "bottomRight" : "topRight";
	positioner.move(pos);
}

// TODO: Remove if not required
function clearCookies() {
	electron.session.defaultSession.clearStorageData([],()=> {
		console.log("Wazzap");
	});
}

ipcMain.on("mini_player", () => {
	win.setSkipTaskbar(true);
	setUpTray();
	win.setSize(370,150);
	positionWin();
});

function setUpTray(){
	tray = new Tray("./icon.ico");
	tray.on("click",()=>{
		win.isVisible()? win.hide() : win.show();
	});
}

ipcMain.on("web_player",()=>{
	tray.destroy();
	win.setSkipTaskbar(false);
	const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
	win.setSize(width, height);
	win.setPosition(0,0);
	win.maximize();
});

ipcMain.on("min_win", () => {
	win.minimize();
});

ipcMain.on("max_win", () => {
	if (win.isMaximized()) {
		win.unmaximize();
	} else {
		win.maximize();
	}
});

ipcMain.on("close_win", () => {
	win.close();
});
