const shortCutHandler = require('app_shortcuts');
const {session, BrowserWindow} = require('electron');
const appMenu = require('./menu_ops.js');

let win;

//app started
function appReady() {
    createWindow();
}


function createWindow() {
    var path= require('path');
    var iconPath=path.join(__dirname,'icon.png');
    var electron=require('electron');
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({width,height, backgroundColor: '#FF6B00', icon: iconPath, title: 'Soundkeys' ,autoHideMenuBar: true});
    win.maximize(); 
    win.setMenu(fetchMenu());
    win.loadURL('https://www.soundcloud.com');
    win.webContents.on('dom-ready',()=>{
        shortCutHandler.initShorts(win);
    });
}

function fetchMenu(){
    appMenu.init(callBackObj);
    return appMenu.getMenu();
}

//app closed
function appClosed() {
    //clearCookies();
    shortCutHandler.destShorts();
}


//browser Window was launched
function newBrowserWindowCreated(event, createdWindow) {
    createdWindow.webContents.on('dom-ready', () => {
        checkIfAuth(createdWindow);
    });
}


function checkIfAuth(window) {
    var webUrl = window.webContents.getURL();
    var facebookSignIn = webUrl.includes("facebook");
    if (facebookSignIn) {
        window.webContents.on('did-get-redirect-request', (event, old, newU, bl, res, req, ref, head) => {
            window.webContents.on('dom-ready', () => {
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

var callBackObj = {
    changeNotify,
    changeShortCuts
};

function changeNotify(notifVal){
    shortCutHandler.changeNotify(notifVal);
}

function changeShortCuts(){
    // TODO: Add shiz
}

module.exports = {
    appReady,
    appClosed,
    newBrowserWindowCreated
};