# SoundKeys

The SoundCloud wrapped in Electron.

Supports Media keys and a few other shortcuts.
Has functionality to specify your own shortcuts too.

Default shortcuts included are:

Global shortcuts :

| Keys                           | Actions          |
|:------------------------------:|:----------------:|
| `MediaNextTrack`               | Next Track       |
| `MediaPreviousTrack`           | Previous Track   |
| `MediaPlayPause`               | Play/Pause Track |
| `Ctrl+4`                       | Repeat Toggle    | 
| `Ctrl+3`                       | Like Toggle      |

When window is visible :
 
| Keys                           | Actions          |
|:------------------------------:|:----------------:|
| `MediaNextTrack or Ctrl+N`     | Next Track       |
| `MediaPreviousTrack or Ctrl+P` | Previous Track   |
| `MediaPlayPause or Space`      | Play/Pause Track |

Notifications: 

Get notified about your actions when the window is not visible.

![Alt text](/Screenshots/likeClicked.PNG)

![Alt text](/Screenshots/repeatClicked.PNG)


**Login issues**:  
As Electron opens each window in a seperate process, login callbacks aren't triggered properly.  
Facebook login might not go through properly. If after login the page is stuck, relaunch the app or press F5 (reload).