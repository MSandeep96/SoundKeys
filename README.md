# SoundKeys

The SoundCloud wrapped in Electron.

Supports Media keys and a few other shortcuts.

Shortcuts included are:

Global shortcuts :

| Keys                           | Actions          |
|:------------------------------:|:----------------:|
| `MediaNextTrack`               | Next Track       |
| `MediaPreviousTrack`           | Previous Track   |
| `MediaPlayPause`               | Play/Pause Track |
| `Ctrl+4`                       | Repeat Toggle    | 
| `Ctrl+3`                       | Like Toggle      |

When window is focused :
 
| Keys                           | Actions          |
|:------------------------------:|:----------------:|
| `MediaNextTrack or Ctrl+N`     | Next Track       |
| `MediaPreviousTrack or Ctrl+P` | Previous Track   |
| `MediaPlayPause or Space`      | Play/Pause Track |

Login issues:
As Electron opens each window in a seperate process, login callbacks are not being triggered properly.
Facebook login might not go through properly. If you're facing this issue. Relaunch the app.