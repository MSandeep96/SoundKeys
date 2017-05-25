const electron = require("electron");
const { app, BrowserWindow, Tray } = require("electron");
const path = require("path");
const url = require("url");
const { ipcMain, globalShortcut, Menu } = require("electron");

let win;
let tray;

app.on("ready", () => {
	createWindow();
	registerShorts();
});

app.on("window-all-closed", () => {
	win = null;
	if(!tray.isDestoryed()){
		tray.destroy();
	}
	app.quit();
});

/**
 * Creates our main window
 */
function createWindow() {

	win = new BrowserWindow({
		frame: false,
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

ipcMain.on("mini_player", () => {
	win.setSkipTaskbar(true);
	setUpTray();
	win.setSize(370, 150);
	positionWin();
});

function setUpTray() {
	const contextMenu = Menu.buildFromTemplate([
		{ label: "Quit", role: "quit" }
	]);
	tray = new Tray("./icon.ico");
	tray.setToolTip("Shows the mini-player");
	tray.setContextMenu(contextMenu);
	tray.on("click", () => {
		win.isVisible() ? win.hide() : win.show();
	});
	tray.on("double-click",()=>{
		// (╯°□°）╯︵ ┻━┻
		win.show();
	});
	tray.on("right-click", () => {
		tray.popUpContextMenu();
	});
}

ipcMain.on("web_player", () => {
	tray.destroy();
	win.setSkipTaskbar(false);
	win.setSize(800, 600);
	win.setPosition(0, 0);
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

ipcMain.on("notify", (event, arg) => {

});
