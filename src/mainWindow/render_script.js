const { ipcRenderer } = require("electron");
const IPC_EVENT = require("../../utils/IPC_EVENT");
const WEB_VIEW_EVENT = require("./WEB_VIEW_EVENT");

var wbView = document.getElementById("wview");

ipcRenderer.on(IPC_EVENT.CONTROL_EVENT_OCCURED, (event, arg) => {
	wbView.send(arg);
});

wbView.addEventListener("did-finish-load", () => {
	document.getElementById("splash-img").style.display = "none";
});

wbView.addEventListener("page-title-updated", () => {
	document.getElementById("title-text").innerHTML = wbView.getTitle();
});

wbView.addEventListener("ipc-message", (event) => {
	switch (event.channel) {
		case WEB_VIEW_EVENT.MIN_PLAYER_BUTTON_CLICKED:
			ipcRenderer.send(IPC_EVENT.SHOW_MINI_PLAYER, event.args[0]);
			break;
		case WEB_VIEW_EVENT.TRACK_CHANGED_UPDATE:
			ipcRenderer.send(IPC_EVENT.UPDATE_MINI_PLAYER, event.args[0]);
			break;
		case WEB_VIEW_EVENT.NOTIFICATION_EVENT:
			ipcRenderer.send(IPC_EVENT.NOTIFICATION_OCCURED, event.args[0]);
			break;
		case WEB_VIEW_EVENT.NO_PLAY_STUFF:
			alert("Play panel must be exist for mini-player", "Soundkeys");
	}
});

function openMiniPlayer() {
	wbView.send(IPC_EVENT.SHOW_MINI_PLAYER);
}

function minimizeWin() {
	ipcRenderer.send(IPC_EVENT.MINIMIZE_WINDOW);
}

function maximizeWin() {
	ipcRenderer.send(IPC_EVENT.MAXIMIZE_WINDOW);
}

function closeWin() {
	ipcRenderer.send(IPC_EVENT.CLOSE_WINDOW);
}

function backNav() {
	if (wbView.canGoBack()) {
		wbView.goBack();
	}
}

function forwNav() {
	if (wbView.canGoForward()) {
		wbView.goForward();
	}
}

function reloadNav() {
	wbView.reload();
}