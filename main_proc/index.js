const shortCutHandler = require('app_shortcuts');
const {session, BrowserWindow} = require('electron');

let win;

//app started
function appReady() {
    createWindow();
}


function createWindow() {
    win = new BrowserWindow({ backgroundColor: '#FF6B00', zoomToPageWidth: true });
    win.maximize();
    win.loadURL('https://www.soundcloud.com');
    shortCutHandler.init(win);
}

//app closed
function appClosed() {
    clearCookies();
    shortCutHandler.dest();
    app.quit();
}


//browser Window was launched
function newBrowserWindowCreated(event, createdWindow) {
    createdWindow.webContents.on('did-finish-load', () => {
        checkIfAuth(createdWindow);
    });
}


function checkIfAuth(window) {
    var webUrl = window.webContents.getURL();
    console.log(webUrl);
    var googleSignIn = webUrl.includes("google");
    var facebookSignIn = webUrl.includes("facebook");
    if (googleSignIn || facebookSignIn) {
        window.webContents.on('did-get-redirect-request', (event, old, newU, bl, res, req, ref, head) => {
            if(googleSignIn){
                window.close();
                win.reload();
            }else{
                window.close();
                proceedFBLogin();
            }
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