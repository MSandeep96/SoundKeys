const {ipcRenderer} = require("electron");

// wbView.addEventListener("dom-ready", function(){ wbView.openDevTools(); });

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