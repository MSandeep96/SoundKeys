const electronLocalshortcut = require('electron-localshortcut');
const {app, BrowserWindow} = require('electron');
const electron = require('electron');

let win;

app.on("ready", createWindow);

function likeClicked() {
    win.webContents.executeJavaScript("document.getElementsByClassName('playbackSoundBadge__like')[0].click()");
}

function nextClicked() {
    win.webContents.executeJavaScript("document.getElementsByClassName('playControls__next')[0].click()");
}

function prevClicked() {
    win.webContents.executeJavaScript("document.getElementsByClassName('playControls__prev')[0].click()");
}

function pauseClicked() {
    win.webContents.executeJavaScript("document.getElementsByClassName('playControls__play')[0].click()");
}

function repeatClicked(){
    win.webContents.executeJavaScript("document.getElementsByClassName('repeatControl')[0].click()");
}

var map = {
    'L': likeClicked,
    'MediaNextTrack': nextClicked,
    'N': nextClicked,
    'MediaPreviousTrack': prevClicked,
    'P': prevClicked,
    'MediaPlayPause': pauseClicked,
    'Space': pauseClicked,
    'A':repeatClicked
};

function mapShortCuts() {
    for (let key in map) {
        electronLocalshortcut.register(win, key, () => {
            map[key].call()
        });
    }
}

function createWindow() {

    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
    win = new BrowserWindow({ width, height });
    win.maximize();
    win.loadURL('https://www.soundcloud.com');
    win.show();

    mapShortCuts();

}


app.on("window-all-closed", () => {
    electronLocalshortcut.unregister(win, 'Ctrl+A');
    electronLocalshortcut.unregisterAll(win);
    app.quit();
})
