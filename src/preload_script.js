const {ipcRenderer} = require("electron");

var inMiniState = false;

var presentTitle;
var trackListener;

ipcRenderer.on("mini_player",(event,arg)=>{

	//set present title of track
	inMiniState = true;
	presentTitle = document.getElementsByClassName("playbackSoundBadge__title")[0].children[1].innerHTML;
	trackListener = setInterval(checkTrackTitle,500);		//check every 500ms for update

	sendTrackDetails();
});

function sendTrackDetails(){
	//send title avatar like and repeat status to host
	var playerState = {};

	playerState.title = presentTitle;

	var songArt = document.getElementsByClassName("playbackSoundBadge__avatar")[0].children[0].children[0];
	var imageStyle = window.getComputedStyle(songArt,false);
	playerState.img_url = imageStyle.backgroundImage.slice(5,-2);
	
	playerState.is_liked = document.getElementsByClassName("playbackSoundBadge__like")[0].classList.contains("sc-button-selected");

	playerState.in_repeat = !document.getElementsByClassName("repeatControl")[0].classList.contains("m-none");

	ipcRenderer.sendToHost("min_play",playerState);
}

function checkTrackTitle(){
	var title = document.getElementsByClassName("playbackSoundBadge__title")[0].children[1].innerHTML;
	console.log(title + " "+ presentTitle);
	if(title !== presentTitle){
		presentTitle = title;
		sendTrackDetails();
	}
}

ipcRenderer.on("web_player",(event,arg)=>{
	clearInterval(trackListener);
});

ipcRenderer.on("nextTrack",(event,arg)=>{
	document.getElementsByClassName("playControls__next")[0].click();
});


ipcRenderer.on("prevTrack",(event,arg)=>{
	document.getElementsByClassName("playControls__prev")[0].click();
});


ipcRenderer.on("playTrack",(event,arg)=>{
	document.getElementsByClassName("playControls__play")[0].click();
});


ipcRenderer.on("likeTrack",(event,arg)=>{
	var likeBtn = document.getElementsByClassName("playbackSoundBadge__like")[0];
	likeBtn.click();
	var title = document.getElementsByClassName("playbackSoundBadge__title")[0].title;
	var imageUrl = document.getElementsByClassName("playbackSoundBadge__avatar")[0].children[0].children[0].style.backgroundImage;
	imageUrl = imageUrl.substring(5,imageUrl.length-2);
	if(likeBtn.className.includes("sc-button-selected")){
		new Notification("Liked",{
			body:title,
			silent:true,
			icon:imageUrl
		});
	}else{
		new Notification("Disliked",{
			body:title,
			silent:true,
			icon:imageUrl
		});
	}
});


ipcRenderer.on("repeatTrack",(event,arg)=>{
	var repeatBtn = document.getElementsByClassName("repeatControl")[0];
	repeatBtn.click();
	if(repeatBtn.className.includes("m-none")){
		new Notification("Repeat : Disabled",{
			body:"Repeat has been disabled",
			silent:true
		});
	}else{
		new Notification("Repeat : Enabled",{
			body:"Repeat has been enabled",
			silent:true
		});
	}
});