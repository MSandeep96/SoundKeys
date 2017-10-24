const IPC_EVENT = require("../utils/IPC_EVENT");
const { ipcRenderer } = require("electron");

let has_scroll = false;
let dir;

ipcRenderer.on(IPC_EVENT.MINI_MUSIC_DETAILS, (event, details) => {
	// update the view

	if (has_scroll) {
		has_scroll = false;
		if (dir > 0) {
			$(".jcarousel").jcarousel("scroll", "+=1");
		} else {
			$(".jcarousel").jcarousel("scroll", "-=1");
		}
	}

	$(".jcarousel img").attr("src", details.img_url);
	$(".song").html(details.title);
	$(".artist").text(details.artist);
	if (details.is_playing) {
		$(".play i").text("pause");
	} else {
		$(".play i").text("play_arrow");
	}

	if (details.is_liked) {
		$(".favorite i").text("favorite").attr("class", "material-icons active");
	} else {
		$(".favorite i").text("favorite_border").attr("class", "material-icons");
	}

	switch (details.repeat_status) {
		case "m-one":
			$(".replay i").attr("class", "material-icons active")
				.text("repeat_one");
			break;
		case "m-all":
			$(".replay i").attr("class", "material-icons active")
				.text("repeat");
			break;
		case "m-none":
			$(".replay i").attr("class", "material-icons")
				.text("repeat");
	}

	if (details.is_shuffling) {
		$(".shuffle").attr("class", "material-icons active");
	} else {
		$(".shuffle").attr("class", "material-icons");
	}
});

$(() => {
	$(".jcarousel").jcarousel({
		wrap: "circular"
	});
});

$(".jcarousel-prev").click(() => {
	has_scroll = true;
	dir = -1;
	ipcRenderer.send(IPC_EVENT.MINI_PLAYER_EVENTS, "prevTrack");
});

$(".jcarousel-next").click(() => {
	has_scroll = true;
	dir = 1;
	ipcRenderer.send(IPC_EVENT.MINI_PLAYER_EVENTS, "nextTrack");
});

$(".favorite").click(() => {
	if ($(".favorite i").text() === "favorite") {
		$(".favorite i").text("favorite_border")
			.removeClass("active");
	} else {
		$(".favorite i").text("favorite")
			.addClass("active");
	}
	ipcRenderer.send(IPC_EVENT.MINI_PLAYER_EVENTS, "likeTrack");
});

$(".shuffle").click(() => {
	$(".shuffle i").toggleClass("active");
	ipcRenderer.send(IPC_EVENT.MINI_PLAYER_EVENTS, "shuffleTrack");
});

$(".replay").click(() => {
	let btn = $(".replay i");
	if (btn.hasClass("active")) {
		if (btn.text() === "repeat_one") {
			btn.text("repeat");
		} else {
			btn.removeClass("active");
		}
	} else {
		btn.addClass("active");
		btn.text("repeat_one");
	}
	ipcRenderer.send(IPC_EVENT.MINI_PLAYER_EVENTS, "repeatTrack");
});

$(".play").click(() => {
	let btn = $(".play i");
	if (btn.text() === "pause") {
		btn.text("play_arrow");
	} else {
		btn.text("pause");
	}
	ipcRenderer.send(IPC_EVENT.MINI_PLAYER_EVENTS, "playTrack");
});

$(".popUp").click(()=>{
	ipcRenderer.send(IPC_EVENT.OPEN_BROWSER_WINDOW);
});