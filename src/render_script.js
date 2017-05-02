var wbView = document.getElementById("wview");
const {ipcRenderer} = require("electron");

wbView.addEventListener("dom-ready", function(){ wbView.openDevTools(); });
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

function exp(){
	wbView.send("webu");
}

console.log("init");