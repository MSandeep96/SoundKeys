const { ipcRenderer, remote } = require("electron");
const IPC_EVENT = require("../utils/IPC_EVENT");
const WEB_VIEW_EVENT = require("./WEB_VIEW_EVENT");
//Mutation observer
let observer;

/*
var oldNotify = window.Notification;
//To hide notifications
window.Notification = function (title, options) {
	if(remote.getCurrentWindow().isFocused()){
		return;
	}
	options["silent"] = true;
	new oldNotify(title,options);
};
*/

/**
 * When in mini player mode, we add a mutation observer which handles track changes.
 */
ipcRenderer.on(IPC_EVENT.SHOW_MINI_PLAYER, () => {

	//set present title of track
	let target = document.getElementsByClassName("playbackSoundBadge")[0];
	if (!target || target.children.length === 0) {
		ipcRenderer.sendToHost("no-play-stuff");
		return;
	}
	observer = new MutationObserver(sendTrackDetails);
	let config = { characterData: true, childList: true };
	observer.observe(target, config);

	sendTrackDetails(false);
});

function sendTrackDetails(inMiniPlayerState) {
	//send title avatar like and repeat status to host
	let playerState = {};

	try {
		playerState.title = document.getElementsByClassName("playbackSoundBadge__title")[0].children[0].children[1].innerHTML;
		if(playerState.title.length>27){
			playerState.title = playerState.title.substr(0,27) + "...";
		}
		playerState.artist = document.getElementsByClassName("playbackSoundBadge__titleContextContainer")[0].children[0].text;

		let songArt = document.getElementsByClassName("playbackSoundBadge__avatar")[0].children[0].children[0];
		let imageStyle = window.getComputedStyle(songArt);
		playerState.img_url = imageStyle.backgroundImage.slice(5, -2);

		playerState.is_liked = document.getElementsByClassName("playbackSoundBadge__like")[0].classList.contains("sc-button-selected");

		playerState.repeat_status = document.getElementsByClassName("repeatControl")[0].classList[2];

		playerState.is_playing = document.getElementsByClassName("playing").length > 0;

		playerState.is_shuffling = document.getElementsByClassName("shuffleControl")[0].classList.contains("m-shuffling");

		if (!inMiniPlayerState) {
			ipcRenderer.sendToHost(WEB_VIEW_EVENT.MIN_PLAYER_BUTTON_CLICKED, playerState);
		}
		else {
			ipcRenderer.sendToHost(WEB_VIEW_EVENT.TRACK_CHANGED_UPDATE, playerState);
		}
	} catch(e){
		alert("Oops! Looks like Soundcloud updated their site. Please open an issue on the project site.", "Scraping failed!");
	}
}

ipcRenderer.on("web_player", () => {
	observer.disconnect();
});

ipcRenderer.on("nextTrack", () => {
	document.getElementsByClassName("playControls__next")[0].click();
});


ipcRenderer.on("prevTrack", () => {
	document.getElementsByClassName("playControls__prev")[0].click();
});

ipcRenderer.on("playTrack", () => {
	document.getElementsByClassName("playControls__play")[0].click();
});


ipcRenderer.on("likeTrack", () => {
	let likeBtn = document.getElementsByClassName("playbackSoundBadge__like")[0];
	likeBtn.click();
	let title = document.getElementsByClassName("playbackSoundBadge__title")[0].title;
	let imageUrl = document.getElementsByClassName("playbackSoundBadge__avatar")[0].children[0].children[0].style.backgroundImage;
	imageUrl = imageUrl.substring(5, imageUrl.length - 2);
	if (likeBtn.className.includes("sc-button-selected")) {
		Notification("Liked", {
			body: title,
			icon: imageUrl,
			silent: true
		});
	} else {
		Notification("Disliked", {
			body: title,
			icon: imageUrl,
			silent: true
		});
	}
});


ipcRenderer.on("repeatTrack", () => {
	let repeatBtn = document.getElementsByClassName("repeatControl")[0];
	repeatBtn.click();
	if (repeatBtn.className.includes("m-none")) {
		Notification("Repeat : Disabled", {
			body: "Repeat has been disabled",
			silent: true
		});
	} else {
		Notification("Repeat : Enabled", {
			body: "Repeat has been enabled",
			silent: true
		});
	}
});

ipcRenderer.on("shuffleTrack", ()=>{
	document.getElementsByClassName("shuffleControl")[0].click();
});