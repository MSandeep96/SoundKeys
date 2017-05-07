const {ipcRenderer} = require("electron");

var wbView = document.getElementById("wview");

ipcRenderer.on("shortCut",(event,arg)=>{
	wbView.send(arg);
});

wbView.addEventListener("did-finish-load", ()=>{
	wbView.openDevTools();
	document.getElementById("splash-img").style.display = "none"; 
});

wbView.addEventListener("page-title-updated",()=>{
	document.getElementById("title-text").innerHTML = wbView.getTitle();
});

wbView.addEventListener("ipc-message",(event)=>{
	if(event.channel==="min_play"){
		setMiniplayer(event.args[0]);
	}
});

function openMiniPlayer(){
	wbView.send("mini_player");
	ipcRenderer.send("mini_player");
	document.getElementById("sc-full").style.display = "none"; 
	document.getElementById("min-play").style.display = "inline";
}

function setMiniplayer(details){
	//set miniplayer elements
	document.getElementsByClassName("mini-img")[0].src= details.img_url;
}

function minimizeWin(){
	ipcRenderer.send("min_win");
}

function maximizeWin(){
	ipcRenderer.send("max_win");
}

function closeWin(){
	ipcRenderer.send("close_win");
}

function prevClicked(){
	wbView.send("prevTrack");
}

function nextClicked(){
	wbView.send("nextTrack");
}

function playClicked(){
	wbView.send("playTrack");
}

function likeClicked(){
	wbView.send("likeTrack");
}

function repeatClicked(){
	wbView.send("repeatTrack");
}

function webClicked(){
	ipcRenderer.send("web_player");
	wbView.send("web_player");
	document.getElementById("sc-full").style.display = "flex"; 
	document.getElementById("min-play").style.display = "none"; 
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