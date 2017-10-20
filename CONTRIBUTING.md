# Contributing to Soundkeys

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

Soundkeys is built on Electron. It's more like an embedded browser just for Soundcloud with cool features like a mini player.

## How can I contribute? 

Everything helps. Open issues, suggest features or open pull requests. 
Make sure your code passes esLint before opening a pull request. 

### Legend  
[main.js](https://github.com/MSandeep96/SoundKeys/blob/master/main.js) The main process starts here. It spawns the browser window which runs 
Soundcloud and mini-player window.

[src/mainWindow](https://github.com/MSandeep96/SoundKeys/tree/master/src/mainWindow) Everything related to the browser window.
[preload_script.js](https://github.com/MSandeep96/SoundKeys/blob/master/src/mainWindow/preload_script.js) is injected into the webview.
[render_script.js](https://github.com/MSandeep96/SoundKeys/blob/master/src/mainWindow/render_script.js) communicates events from the webview and
other interactions from the window.

[src/miniPlayerWindow](https://github.com/MSandeep96/SoundKeys/tree/master/src/miniPlayerWindow) Everything related to the mini player window.
