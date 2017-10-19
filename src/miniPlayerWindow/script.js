const IPC_EVENT = require("../../utils/IPC_EVENT");
const { ipcRenderer } = require("electron");

ipcRenderer.on(IPC_EVENT.MINI_MUSIC_DETAILS, (event,details) => {
	// update the view
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
});

function prevClicked() {
	//just in case, track doesnt have anything to skip backward to
	var play = document.getElementsByClassName("pc-play")[0].children[0];
	if (play.classList.contains("fa-play")) {
		play.classList.add("fa-pause");
		play.classList.remove("fa-play");
	}
	ipcRenderer.send(IPC_EVENT.MINI_PLAYER_EVENTS, "prevTrack");
}

function nextClicked() {
	//just in case, track doesnt have anything to skip forward to
	var play = document.getElementsByClassName("pc-play")[0].children[0];
	if (play.classList.contains("fa-play")) {
		play.classList.add("fa-pause");
		play.classList.remove("fa-play");
	}
	ipcRenderer.send(IPC_EVENT.MINI_PLAYER_EVENTS, "nextTrack");
}

function playClicked() {
	var play = document.getElementsByClassName("pc-play")[0].children[0];
	var is_playing = play.classList.contains("fa-pause");
	play.classList.add(is_playing ? "fa-play" : "fa-pause");
	play.classList.remove(is_playing ? "fa-pause" : "fa-play");
	ipcRenderer.send(IPC_EVENT.MINI_PLAYER_EVENTS, "playTrack");
}

function likeClicked() {
	var likeBtn = document.getElementsByClassName("so-like")[0];
	if (likeBtn.classList.contains("activated")) {
		likeBtn.classList.remove("activated");
	} else {
		likeBtn.classList.add("activated");
	}
	ipcRenderer.send(IPC_EVENT.MINI_PLAYER_EVENTS, "likeTrack");
}

function repeatClicked() {
	var repeatBtn = document.getElementsByClassName("so-repeat")[0];
	if (repeatBtn.classList.contains("activated")) {
		repeatBtn.classList.remove("activated");
	} else {
		repeatBtn.classList.add("activated");
	}
	ipcRenderer.send(IPC_EVENT.MINI_PLAYER_EVENTS, "repeatTrack");
}

function webClicked() {
	ipcRenderer.send(IPC_EVENT.OPEN_BROWSER_WINDOW);
}