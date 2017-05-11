const { ipcRenderer } = require("electron");

var wbView = document.getElementById("wview");

var musicPlayed = false;

ipcRenderer.on("shortCut", (event, arg) => {
	eval(arg + "()");
});

wbView.addEventListener("no-play-stuff",()=>{
	alert("Nothing to play here","Soundkeys");
});

wbView.addEventListener("did-finish-load", () => {
	document.getElementById("splash-img").style.display = "none";
	wbView.openDevTools();
});

wbView.addEventListener("page-title-updated", () => {
	document.getElementById("title-text").innerHTML = wbView.getTitle();
});

wbView.addEventListener("ipc-message", (event) => {
	if (event.channel === "min_play") {
		setMiniplayer(event.args[0]);
	}else if(event.channel === "no-play-stuff"){
		alert("Nothing to play here","Soundkeys");
	}
});

wbView.addEventListener("media-started-playing",(event)=>{
	musicPlayed = true;
});

function openMiniPlayer() {
	if(!musicPlayed){
		alert("Press play on any song before launching mini player","Soundkeys");
		return;
	}
	wbView.send("mini_player");
}

function setMiniplayer(details) {
	//set miniplayer elements
	ipcRenderer.send("mini_player");
	document.getElementById("sc-full").style.display = "none";
	document.getElementById("min-play").style.display = "inline";
	document.getElementsByClassName("min-img")[0].src = details.img_url;
	document.getElementsByClassName("track-details")[0].innerHTML = details.title;
	var play = document.getElementsByClassName("pc-play")[0].children[0];
	play.classList.remove(details.is_playing ? "fa-play" : "fa-pause");
	play.classList.add(details.is_playing ? "fa-pause" : "fa-play");
	var likeBtn = document.getElementsByClassName("so-like")[0];
	if (details.is_liked) {
		if (!likeBtn.classList.contains("activated"))
			likeBtn.classList.add("activated");
	} else {
		likeBtn.classList.remove("activated");
	}
	var repeatBtn = document.getElementsByClassName("so-repeat")[0];
	if (details.in_repeat) {
		if (!repeatBtn.classList.contains("activated"))
			repeatBtn.classList.add("activated");
	} else {
		repeatBtn.classList.remove("activated");
	}
}

function minimizeWin() {
	ipcRenderer.send("min_win");
}

function maximizeWin() {
	ipcRenderer.send("max_win");
}

function closeWin() {
	ipcRenderer.send("close_win");
}

function prevClicked() {
	//just in case, track doesnt have anything to skip backward to
	var play = document.getElementsByClassName("pc-play")[0].children[0];
	if (play.classList.contains("fa-play")) {
		play.classList.add("fa-pause");
		play.classList.remove("fa-play");
	}
	wbView.send("prevTrack");
}

function nextClicked() {
	//just in case, track doesnt have anything to skip forward to
	var play = document.getElementsByClassName("pc-play")[0].children[0];
	if (play.classList.contains("fa-play")) {
		play.classList.add("fa-pause");
		play.classList.remove("fa-play");
	}
	wbView.send("nextTrack");
}

function playClicked() {
	var play = document.getElementsByClassName("pc-play")[0].children[0];
	var is_playing = play.classList.contains("fa-pause");
	console.log(is_playing);
	play.classList.add(is_playing ? "fa-play" : "fa-pause");
	play.classList.remove(is_playing ? "fa-pause" : "fa-play");
	wbView.send("playTrack");
}

function likeClicked() {
	var likeBtn = document.getElementsByClassName("so-like")[0];
	if (likeBtn.classList.contains("activated")) {
		likeBtn.classList.remove("activated");
	} else {
		likeBtn.classList.add("activated");
	}
	wbView.send("likeTrack");
}

function repeatClicked() {
	var repeatBtn = document.getElementsByClassName("so-repeat")[0];
	if (repeatBtn.classList.contains("activated")) {
		repeatBtn.classList.remove("activated");
	} else {
		repeatBtn.classList.add("activated");
	}
	wbView.send("repeatTrack");
}

function webClicked() {
	ipcRenderer.send("web_player");
	wbView.send("web_player");
	document.getElementById("sc-full").style.display = "flex";
	document.getElementById("min-play").style.display = "none";
}

function backNav() {
	if (wbView.canGoBack()) {
		wbView.goBack();
	}
}

function forwNav() {
	if (wbView.canGoForward()) {
		wbView.goForward();
	}
}

function reloadNav() {
	wbView.reload();
}