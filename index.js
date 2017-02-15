const {app, BrowserWindow} = require('electron');
const electron = require('electron');

const {session} = require('electron');

var shortCutHandler = require('app_shortcuts');

let win;

app.on("ready", createWindow);

function createWindow() {
    win = new BrowserWindow({ backgroundColor: '#FF6B00', zoomToPageWidth: true });
    win.maximize();
    win.loadURL('https://www.soundcloud.com');
    //shortCutHandler.init(win);
}

function clearCookies() {
    session.defaultSession.clearStorageData([], function (data) {
        console.log("Wazzap");
    });
}

app.on('browser-window-created', (event, window) => {
    window.webContents.on('did-finish-load', () => {
        checkIfAuth(window);
    });
});

function checkIfAuth(window) {
    var webUrl = window.webContents.getURL();
    console.log(webUrl);
    var googleSignIn = webUrl.includes("google");
    var facebookSignIn = webUrl.includes("facebook");
    if (googleSignIn || facebookSignIn) {
        window.webContents.on('did-get-redirect-request', (event, old, newU, bl, res, req, ref, head) => {
            if (googleSignIn) {
                window.close();
                win.reload();
            }else{
                window.close();
                proceedFBLogin();
            }
        });
    }
}

function proceedFBLogin(){
    win.webContents.executeJavaScript(
        'document.getElementsByClassName("signinInitialStep_fbLink")[0].click();'
    );
}

app.on("window-all-closed", () => {
    clearCookies();
    //shortCutHandler.dest();
    app.quit();
});

