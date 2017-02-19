const electronLocalshortcut = require('electron-localshortcut');
const {globalShortcut} = require('electron');
const codesExec = require('./exec_code');
const Config = require('electron-config');
const config = new Config({name:'soundkeys_config'});

let win;
let zoomFactor;

var notify = true;

var map = {
    'Ctrl+N': nextClicked,
    'Ctrl+P': prevClicked,
    'Space': pauseClicked,
    'F5': reloadWind,
    'Ctrl+=': zoomIncrease,
    'Ctrl+-': zoomDecrease
};

var globalMap = {
    'MediaNextTrack': nextClicked,
    'MediaPreviousTrack': prevClicked,
    'MediaPlayPause': pauseClicked,
    'Ctrl+3': likeClicked,
    'Ctrl+4': repeatClicked
};

function reloadWind(){
    win.reload();
}

function zoomIncrease(){
    if(zoomFactor!=5){
        zoomFactor+=0.1;
        win.webContents.setZoomFactor(zoomFactor);
    }
}

function zoomDecrease(){
    if(zoomFactor!=0.3){
        zoomFactor-=0.1;
        win.webContents.setZoomFactor(zoomFactor);
    }
}

function likeClicked() {
    var execJs=codesExec.likeClicked;
    if(!win.isFocused() && notify){
        execJs+=codesExec.likeClickedNotify;
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
    var execJs=codesExec.repeatClickedJScript;
    if(!win.isFocused() && notify){
        execJs+=codesExec.repeatClickedNotify;
    }
    win.webContents.executeJavaScript(execJs);
}

function initShorts(window,zmFactor) {
    win = window;
    for (let key in map) {
        electronLocalshortcut.register(win, key, () => {
            map[key].call();
        });
    }
    for (let key in globalMap) {
        globalShortcut.register(key, () => {
            globalMap[key].call();
        })
    }
    zoomFactor=zmFactor;
}

function destShorts() {
    win = null;
    electronLocalshortcut.unregisterAll(win);
}

function changeNotify(notify_val){
    notify=notify_val;
}

function getZoomFactor(){
    return zoomFactor;
}

module.exports = {
    initShorts,
    destShorts,
    changeNotify,
    getZoomFactor
};