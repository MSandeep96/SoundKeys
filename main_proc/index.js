const shortCutHandler = require('../app_shortcuts');
const {session, BrowserWindow} = require('electron');
const appMenu = require('./menu_ops.js');
const Config = require('electron-config');
const config = new Config({name:'soundkeys_config'});

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
    loadUserSettings();
}

function fetchMenu(){
    appMenu.init(callBackObj);
    return appMenu.getMenu();
}

function loadUserSettings(){
    var zoom_fac;
    if(!config.has('first_time')){
        zoom_fac=1.0;
        config.set('first_time',false);
        config.set('zoom_factor',zoom_fac);
        var ops={
            type: "info",
            buttons: [],
            title : "Settings",
            message: "For disabling notifications or editing shortcuts, press [Alt] to reveal the title bar."
        }
        var {dialog} = require('electron');
        dialog.showMessageBox(win,ops);
    }else{
        zoom_fac=config.get('zoom_factor');
        //TODO: Bug in electron can't deploy this issue
        /*win.webContents.on('dom-ready',()=>{
            win.webContents.setZoomFactor(zoom_fac);
        });*/
    }
    shortCutHandler.initShorts(win,zoom_fac);
}

//app closed
function appClosed() {
    //clearCookies();
    config.set('zoom_factor',shortCutHandler.getZoomFactor());
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