const shortCutHandler = require('../app_shortcuts');
const {session, BrowserWindow} = require('electron');
const appMenu = require('./menu_ops.js');
const Config = require('electron-config');
const config = new Config({ name: 'soundkeys_config' });

var dataPath;

let win;

//app started
function appReady(appFolder) {
    dataPath = appFolder;
    createWindow();
}

//create default window
function createWindow() {
    var path = require('path');
    var iconPath = path.join(__dirname, 'icon.png');
    var electron = require('electron');
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({ width, height, backgroundColor: '#FF6B00', icon: iconPath, title: 'Soundkeys', autoHideMenuBar: true });
    win.maximize();
    win.setMenu(fetchMenu());
    win.loadURL('https://www.soundcloud.com');
    loadUserSettings();
}

//gets the menu object from it's module menu_ops.js
function fetchMenu() {
    appMenu.init(callBackObj);
    return appMenu.getMenu();
}

//loading user preferences
function loadUserSettings() {
    var zoom_fac;

    // if launched for the first time, set zoom & copy shortcuts to dataPath folder 
    if (!config.has('first_time')) {
        zoom_fac = 1.0;
        config.set('first_time', false);
        config.set('zoom_factor', zoom_fac);
        displayFirstTimeDialog();
        copyShortCutsFile();
    } else {

        zoom_fac = config.get('zoom_factor');
        //TODO: Bug in electron can't deploy this. Fixed in merged pull request. Wait for update.
        /*win.webContents.on('dom-ready',()=>{
            win.webContents.setZoomFactor(zoom_fac);
        });*/
    }

    //attach the shortcuts of the app
    shortCutHandler.initShorts(win, zoom_fac, dataPath);
}

//dialog to tell user that title bar is hidden
function displayFirstTimeDialog() {
    var ops = {
        type: "info",
        buttons: [],
        title: "Settings",
        message: "For disabling notifications or editing shortcuts, press [Alt] to reveal the title bar."
    }
    var {dialog} = require('electron');
    dialog.showMessageBox(win, ops);
}

//copy shortcuts to dataPath folder
function copyShortCutsFile() {
    var fs = require('fs');
    var shorts = fs.readFileSync('./app_shortcuts/mappings.json');
    fs.writeFileSync(dataPath + '\\mappings.json', shorts);
}

//app closed
function appClosed() {
    //clearCookies();
    config.set('zoom_factor', shortCutHandler.getZoomFactor());
    shortCutHandler.destShorts();
}


//browser Window was launched, assists in login
function newBrowserWindowCreated(event, createdWindow) {
    createdWindow.webContents.on('dom-ready', () => {
        checkIfAuth(createdWindow);
    });
}

// tries to solve issue with facebook login 50% of the time
function checkIfAuth(window) {
    var webUrl = window.webContents.getURL();
    var facebookSignIn = webUrl.includes("facebook");
    if (facebookSignIn) {
        window.webContents.on('did-get-redirect-request', (event, old, newU, bl, res, req, ref, head) => {
            window.webContents.on('dom-ready', () => {
                if (facebookSignIn) {
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

//callbacks from menu TODO: Consider using eventEmitter
var callBackObj = {
    changeNotify,
    changeShortcuts
};

function changeNotify(notifVal) {
    shortCutHandler.changeNotify(notifVal);
}

function changeShortcuts() {
    var mappingsPath = dataPath + '\\mappings.json';
    var fs = require('fs');
    if(!fs.existsSync(mappingsPath)){
        copyShortCutsFile();
    }
    var {shell} = require('electron');
    shell.openItem(mappingsPath);
}

module.exports = {
    appReady,
    appClosed,
    newBrowserWindowCreated
};