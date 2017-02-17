const shortCutHandler = require('app_shortcuts');
const electron=require('electron');
const {session, BrowserWindow} = require('electron');
const path= require('path');

const iconPath=path.join(__dirname,'icon.png');

let win;
let tray;
//app started
function appReady() {
    createWindow();
}


function createWindow() {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({width,height, backgroundColor: '#FF6B00', icon });
    win.loadURL('https://www.soundcloud.com');
    shortCutHandler.initShorts(win);
}

//app closed
function appClosed() {
    //clearCookies();
    shortCutHandler.destShorts();
}


//browser Window was launched
function newBrowserWindowCreated(event, createdWindow) {
    createdWindow.webContents.on('did-finish-load', () => {
        checkIfAuth(createdWindow);
    });
}


function checkIfAuth(window) {
    var webUrl = window.webContents.getURL();
    var googleSignIn = webUrl.includes("google");
    var facebookSignIn = webUrl.includes("facebook");
    if (googleSignIn || facebookSignIn) {
        window.webContents.on('did-get-redirect-request', (event, old, newU, bl, res, req, ref, head) => {
            window.webContents.on('did-finish-load', () => {
                if(facebookSignIn){
                    window.close();
                    proceedFBLogin();
                }
            });
        });
    }
}


function proceedFBLogin() {
    //need to click a hidden link for login
    win.webContents.executeJavaScript(
        'document.getElementsByClassName("signinInitialStep_fbLink")[0].click();'
    );
}


// TODO: Remove if not required
function clearCookies() {
    session.defaultSession.clearStorageData([], function (data) {
        console.log("Wazzap");
    });
}


module.exports = {
    appReady,
    appClosed,
    newBrowserWindowCreated
};