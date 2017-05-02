const {ipcRenderer} = require("electron");
/*
wbView.addEventListener("ipc-message",(e)=>{
	console.log("here");
	console.log(e.channel+ " " + e.arg);
	ipcRenderer.send("got_data","wassup");
});

ipcRenderer.on("alright",(event,arg)=>{
	console.log(arg);
});

ipcRenderer.on("webu",(event,arg)=>{
	wbView.send("webu",arg);
});
*/

var wbView = document.getElementById("wview");

wbView.addEventListener("did-finish-load", ()=>{ 
	console.log("here");
	console.log(document.getElementById("splash-img"));
	document.getElementById("splash-img").style.display = "none"; 
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