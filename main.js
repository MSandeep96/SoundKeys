const electron = require("electron");
const { app, BrowserWindow, Tray } = require("electron");
const path = require("path");
const url = require("url");
const { ipcMain, globalShortcut, Menu } = require("electron");
const IPC_EVENT = require("./utils/IPC_EVENT");
const utils = require("./utils/utils");

let mainWindow;
let trayButton;
let miniPlayerWindow;

let iconPath;

var inMiniPlayerMode = false;

/**
 * Create main window, miniplayer window and register shortcuts.
 */
app.on("ready", () => {
	iconPath = path.join(__dirname, "./icon.ico");
	createWindow();
	var bounds = setUpTray();
	createMiniPlayerWindow(bounds);
	positionWin();
	registerShorts();
});

app.on("window-all-closed", () => {
	mainWindow = null;
	miniPlayerWindow = null;
	if (trayButton && !trayButton.isDestoryed()) {
		trayButton.destroy();
	}
	trayButton = null;
	ipcMain.removeAllListeners();
	app.quit();
});

function createWindow() {
	mainWindow = new BrowserWindow({
		frame: false,
		icon: iconPath,
		backgroundColor: "#333333",
		title: "Soundkeys",
		autoHideMenuBar: true
	});

	mainWindow.maximize();

	var htmlUrl = url.format({
		pathname: path.join(__dirname, "./src/mainWindow/index.html"),
		protocol: "file:",
		slashes: true
	});

	mainWindow.loadURL(htmlUrl);
	mainWindow.webContents.on("new-window", function (event, url, frameName, disposition, windowOptions) {
		windowOptions["node-integration"] = false;
	});
}

function createMiniPlayerWindow(bounds) {
	// var windCoords = utils.figureOutPosition(bounds,electron.screen.getPrimaryDisplay().workAreaSize);
	miniPlayerWindow = new BrowserWindow({
		frame: false,
		backgroundColor: "#333333",
		skipTaskbar: true,
		resizable: false,
		width: 370,
		height: 150,
		show: false
	});

	var htmlUrl = url.format({
		pathname: path.join(__dirname, "./src/miniPlayerWindow/index.html"),
		protocol: "file:",
		slashes: true
	});

	miniPlayerWindow.loadURL(htmlUrl);
}

function registerShorts() {

	const mappings = {
		"MediaNextTrack": "nextClicked",
		"MediaPreviousTrack": "prevClicked",
		"MediaPlayPause": "playClicked",
		"CommandOrControl+3": "likeClicked",
		"CommandOrControl+4": "repeatClicked"
	};

	for (let key in mappings) {
		globalShortcut.register(key, () => {
			if (inMiniPlayerMode)
				miniPlayerWindow.webContents.send(IPC_EVENT.CONTROL_EVENT_OCCURED, mappings[key]);
			else
				mainWindow.webContents.send(IPC_EVENT.CONTROL_EVENT_OCCURED, mappings[key]);
		});
	}

	globalShortcut.register("MediaStop", () => {
		//quit the app?
		if (inMiniPlayerMode)
			miniPlayerWindow.close();
		else
			mainWindow.close();
	});

}

ipcMain.on(IPC_EVENT.MINIMIZE_WINDOW, () => {
	mainWindow.minimize();
});

ipcMain.on(IPC_EVENT.MAXIMIZE_WINDOW, () => {
	if (mainWindow.isMaximized()) {
		mainWindow.unmaximize();
	} else {
		mainWindow.maximize();
	}
});

ipcMain.on(IPC_EVENT.CLOSE_WINDOW, () => {
	mainWindow.close();
	miniPlayerWindow.close();
});

/**
 * Moving to mini player state. 
 */
ipcMain.on(IPC_EVENT.SHOW_MINI_PLAYER, (event, details) => {
	inMiniPlayerMode = true;
	mainWindow.setSkipTaskbar(true);
	mainWindow.hide();
	miniPlayerWindow.show();
	miniPlayerWindow.webContents.send(IPC_EVENT.MINI_MUSIC_DETAILS, details);
});

ipcMain.on(IPC_EVENT.UPDATE_MINI_PLAYER, (event, eventDetails) => {
	miniPlayerWindow.webContents.send(IPC_EVENT.MINI_MUSIC_DETAILS, eventDetails);
});

/**
 * Moving to browser state.
 */
ipcMain.on(IPC_EVENT.OPEN_BROWSER_WINDOW, () => {
	inMiniPlayerMode = false;
	miniPlayerWindow.hide();
	mainWindow.setSkipTaskbar(false);
	mainWindow.show();
});

function positionWin() {
	var Positioner = require("electron-positioner");
	var positioner = new Positioner(miniPlayerWindow);
	var pos = (process.platform === "win32") ? "bottomRight" : "topRight";
	positioner.move(pos);
}

function setUpTray() {
	const contextMenu = Menu.buildFromTemplate([
		{ label: "Quit", role: "quit" }
	]);
	trayButton = new Tray(iconPath);
	trayButton.setToolTip("Shows the mini-player");
	trayButton.setContextMenu(contextMenu);
	trayButton.on("click", () => {
		if (inMiniPlayerMode)
			miniPlayerWindow.isVisible() ? miniPlayerWindow.hide() : miniPlayerWindow.show();
		else
			mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
	});
	trayButton.on("double-click", () => {
		// (╯°□°）╯︵ ┻━┻
		if (inMiniPlayerMode)
			miniPlayerWindow.show();
		else
			mainWindow.show();
	});
	trayButton.on("right-click", () => {
		trayButton.popUpContextMenu();
	});
	return trayButton.getBounds();
}

ipcMain.on(IPC_EVENT.MINI_PLAYER_EVENTS, (event,args) => {
	mainWindow.webContents.send(IPC_EVENT.CONTROL_EVENT_OCCURED,args);
});

ipcMain.on("notify", (event, arg) => {

});
