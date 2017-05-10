const { ipcRenderer } = require("electron");

//Mutation observer
var observer;

//To hide notifications
var Notification = function(){};
window.Notification = Notification;

ipcRenderer.on("mini_player", (event, arg) => {

	//set present title of track
	var target = document.getElementsByClassName("playbackSoundBadge")[0];
	observer = new MutationObserver(sendTrackDetails);
	var config = { characterData: true,childList: true };
	observer.observe(target, config);

	sendTrackDetails();
});

function sendTrackDetails() {
	//send title avatar like and repeat status to host
	var playerState = {};

	playerState.title = document.getElementsByClassName("playbackSoundBadge__title")[0].children[1].innerHTML;

	var songArt = document.getElementsByClassName("playbackSoundBadge__avatar")[0].children[0].children[0];
	var imageStyle = window.getComputedStyle(songArt, false);
	playerState.img_url = imageStyle.backgroundImage.slice(5, -2);

	playerState.is_liked = document.getElementsByClassName("playbackSoundBadge__like")[0].classList.contains("sc-button-selected");

	playerState.in_repeat = !document.getElementsByClassName("repeatControl")[0].classList.contains("m-none");

	playerState.is_playing = document.getElementsByClassName("playing").length > 0;

	ipcRenderer.sendToHost("min_play", playerState);
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
		new Notification("Liked", {
			body: title,
			silent: true,
			icon: imageUrl
		});
	} else {
		new Notification("Disliked", {
			body: title,
			silent: true,
			icon: imageUrl
		});
	}
});


ipcRenderer.on("repeatTrack", (event, arg) => {
	var repeatBtn = document.getElementsByClassName("repeatControl")[0];
	repeatBtn.click();
	if (repeatBtn.className.includes("m-none")) {
		new Notification("Repeat : Disabled", {
			body: "Repeat has been disabled",
			silent: true
		});
	} else {
		new Notification("Repeat : Enabled", {
			body: "Repeat has been enabled",
			silent: true
		});
	}
});