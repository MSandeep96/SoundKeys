const {ipcRenderer} = require("electron");

var wbView = document.getElementById("wview");

ipcRenderer.on("shortCut",(event,arg)=>{
	wbView.send(arg);
});

wbView.addEventListener("did-finish-load", ()=>{
	document.getElementById("splash-img").style.display = "none"; 
});

wbView.addEventListener("page-title-updated",()=>{
	document.getElementById("title-text").innerHTML = wbView.getTitle();
});

function minimizeWin(){
	ipcRenderer.send("min_win");
}

function maximizeWin(){
	ipcRenderer.send("max_win");
}

function closeWin(){
	ipcRenderer.send("close_win");
}

function backNav(){
	if(wbView.canGoBack()){
		wbView.goBack();
	}
}

function forwNav(){
	if(wbView.canGoForward()){
		wbView.goForward();
	}
}

function reloadNav(){
	wbView.reload();
}