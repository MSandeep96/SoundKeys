# <img src='./main_proc/icon.png' height='37' align='center' alt='Soundkeys Logo'> SoundKeys

The SoundCloud website wrapped in Electron with shortcuts for a native experience.

Supports Media keys and a few other shortcuts.  
User can further edit the shortcuts to his desire.  
(Setting->Edit Shortcuts)

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

## Notifications 

Get notified about your actions when the window is not visible.

![Alt text](/Screenshots/likeClicked.PNG)

![Alt text](/Screenshots/repeatClicked.PNG)


### Install

Download from [here](https://github.com/MSandeep96/SoundKeys/releases).

##### Login issues:

As Electron opens each window in a seperate process, login callbacks aren't triggered properly.  
If the application stalls for you, reload the page and try to login again.  
Reload is mapped to F5.