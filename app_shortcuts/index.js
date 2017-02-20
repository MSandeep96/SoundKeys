const electronLocalshortcut = require('electron-localshortcut');
const {globalShortcut} = require('electron');
const codesExec = require('./exec_code');
const Config = require('electron-config');
const config = new Config({ name: 'soundkeys_config' });


let win;
let zoomFactor;

var notify = true;

function reloadWind() {
    win.reload();
}

function zoomIncrease() {
    if (zoomFactor != 5) {
        zoomFactor += 0.1;
        win.webContents.setZoomFactor(zoomFactor);
    }
}

function zoomDecrease() {
    if (zoomFactor != 0.3) {
        zoomFactor -= 0.1;
        win.webContents.setZoomFactor(zoomFactor);
    }
}

function likeClicked() {
    var execJs = codesExec.likeClicked;
    if (!win.isFocused() && notify) {
        execJs += codesExec.likeClickedNotify;
    }
    win.webContents.executeJavaScript(execJs);
}

function nextClicked() {
    win.webContents.executeJavaScript(codesExec.nextClicked);
}

function prevClicked() {
    win.webContents.executeJavaScript(codesExec.prevClicked);
}

function pauseClicked() {
    win.webContents.executeJavaScript(codesExec.pauseClicked);
}

function repeatClicked() {
    var execJs = codesExec.repeatClickedJScript;
    if (!win.isFocused() && notify) {
        execJs += codesExec.repeatClickedNotify;
    }
    win.webContents.executeJavaScript(execJs);
}

function initShorts(window, zmFactor, dataPath) {
    win = window;
    var mappings = getMappings(dataPath);
    for (let key in mappings.map) {
        electronLocalshortcut.register(win, key, () => {
            eval(mappings.map[key] + "()");
        });
    }
    for (let key in mappings.globalMap) {
        globalShortcut.register(key, () => {
            eval(mappings.globalMap[key] + "()");
        })
    }
    zoomFactor = zmFactor;
}

function getMappings(dataPath) {
    var mappingsPath = dataPath + '\\mappings.json';
    var fs = require('fs');
    if (fs.existsSync(mappingsPath)) {
        var stringMappings = fs.readFileSync(dataPath + '\\mappings.json', "utf-8");
        var jsonminify = require("jsonminify");
        return JSON.parse(JSON.minify(stringMappings));
    }else{
        return {};
    }
}

function destShorts() {
    electronLocalshortcut.unregisterAll(win);
    win = null;
}

function changeNotify(notify_val) {
    notify = notify_val;
}

function getZoomFactor() {
    return zoomFactor;
}

module.exports = {
    initShorts,
    destShorts,
    changeNotify,
    getZoomFactor
};