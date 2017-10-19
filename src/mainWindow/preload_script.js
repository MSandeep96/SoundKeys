const { ipcRenderer, remote } = require("electron");
const IPC_EVENT = require("../../utils/IPC_EVENT");
const WEB_VIEW_EVENT = require("./WEB_VIEW_EVENT");
//Mutation observer
var observer;

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
ipcRenderer.on(IPC_EVENT.SHOW_MINI_PLAYER, (event, arg) => {

	//set present title of track
	var target = document.getElementsByClassName("playbackSoundBadge")[0];
	if (!target || target.children.length == 0) {
		ipcRenderer.sendToHost("no-play-stuff");
		return;
	}
	observer = new MutationObserver(sendTrackDetails);
	var config = { characterData: true, childList: true };
	observer.observe(target, config);

	sendTrackDetails(false);
});

function sendTrackDetails(inMiniPlayerState) {
	//send title avatar like and repeat status to host
	var playerState = {};

	try {
		playerState.title = document.getElementsByClassName("playbackSoundBadge__title")[0].children[0].children[1].innerHTML;

		var songArt = document.getElementsByClassName("playbackSoundBadge__avatar")[0].children[0].children[0];
		var imageStyle = window.getComputedStyle(songArt, false);
		playerState.img_url = imageStyle.backgroundImage.slice(5, -2);

		playerState.is_liked = document.getElementsByClassName("playbackSoundBadge__like")[0].classList.contains("sc-button-selected");

		playerState.in_repeat = !document.getElementsByClassName("repeatControl")[0].classList.contains("m-none");

		playerState.is_playing = document.getElementsByClassName("playing").length > 0;

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

ipcRenderer.on("web_player", (event, arg) => {
	observer.disconnect();
});

ipcRenderer.on("nextTrack", (event, arg) => {
	document.getElementsByClassName("playControls__next")[0].click();
});


ipcRenderer.on("prevTrack", (event, arg) => {
	document.getElementsByClassName("playControls__prev")[0].click();
});

ipcRenderer.on("playTrack", (event, arg) => {
	document.getElementsByClassName("playControls__play")[0].click();
});


ipcRenderer.on("likeTrack", (event, arg) => {
	var likeBtn = document.getElementsByClassName("playbackSoundBadge__like")[0];
	likeBtn.click();
	var title = document.getElementsByClassName("playbackSoundBadge__title")[0].title;
	var imageUrl = document.getElementsByClassName("playbackSoundBadge__avatar")[0].children[0].children[0].style.backgroundImage;
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


ipcRenderer.on("repeatTrack", (event, arg) => {
	var repeatBtn = document.getElementsByClassName("repeatControl")[0];
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