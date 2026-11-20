# "How it works" scene films

The "How it works" section plays by itself once it is on screen: five short films, one per step, with the step card changing as each one starts. Then it loops. The engine is `js/scene.js`.

## The idea: the van is on the page, not in a video box

Some films are **seamless**: the subject sits on one flat background color, and the page behind the film is painted the same color. So the van reads as rolling across the page itself.

- The van film was generated on a flat gold studio background, then every background pixel was set to brand gold `#F7B334`.
- The exploded mill sits on a navy studio background, and the page turns navy while it plays.
- The other films are **tiles**: rounded cards on phones, full width on desktop (the upright Lap 2 clip sits as a tilted card beside the text on desktop).

## What is here now (`film/`)

| Step | Film | What happens | Source | Look |
|---|---|---|---|---|
| Lap 1 | `1-van` | Van drives in from the left edge of the page and parks, the side door slides open, the camera pushes to the doorway | Kling 4.0, gold studio (two clips joined) | seamless |
| Lap 2 | `2-warmup` | Emelyn clips the harness on, love pats, a treat | Zach's Kling clip (upright) | tile |
| Lap 3 | `3-trot` | Happy slow-motion trot, tongue flapping, no saliva | Zach's Kling clip | tile |
| Pit stop | `4-mill` | Slat mill comes apart and goes back together | Kling 4.0, from a studio still of her real mill | seamless |
| Finish line | `5-nap` | Pup hops out, curls up on a dog bed, falls asleep | Kling 4.0 | tile |

Each film has a desktop file (`name.mp4`, 1280 x 720) and a phone file (`name-m.mp4`), except `2-warmup`, which uses one file for both. Phone total is about 2.3 MB, desktop about 4.2 MB. No sound.

Nothing here loads until the page itself has finished loading. Then the first film loads when the section is near, and each next film loads while the one before it plays.

`nap-still.webp` is one frame of the nap, used as a sticker in the big "zoomies / snoozies" band.

**Push-in note:** the push-in is cut at 3.75 s on purpose. After that point Kling drew ordinary motorized-looking treadmills inside the van, which is wrong for a "no motor" business. The scene hands off to the Lap 2 film instead.

**Lap 2 note:** Zach's clip has Instagram caption text burned into the lower part of the frame and a Kling watermark, so the bottom 18% is cropped off. A clean export would let the whole frame show.

## Swapping in a new clip

1. Export the clip without a watermark, 1080p. 16:9 for most steps; upright is fine for a tile.
2. Encode it (no sound, 24 frames a second):
   ```
   # desktop
   ffmpeg -i clip.mp4 -an -vf "fps=24,scale=1280:720" -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart film/3-trot.mp4
   # phone, tile film (crop to the tile shape; 137 = how far from the left the crop starts, 0 to 304)
   ffmpeg -i clip.mp4 -an -vf "fps=24,scale=1280:720,crop=976:720:137:0,scale=640:472" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart film/3-trot-m.mp4
   # phone, seamless film (whole frame)
   ffmpeg -i clip.mp4 -an -vf "fps=24,scale=854:480" -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart film/4-mill-m.mp4
   ```
3. **Give the new file a new name** (for example `3-trot-v2.mp4`) and update the name in `js/scene.js`. Files in `/assets` are cached by browsers for a year, so overwriting an old name will not reach people who already visited.
4. For a gold seamless film, the gold in the clip will not be exactly brand gold. Shift the background to `#F7B334` (any video tool with a color replace limited to the background, or the small script ZDub used in the build session). Without this you get a faint box around the film.
5. In `js/scene.js`, the `FILMS` list at the top holds one line per film: file name, which step card it belongs to, the look (`seamless` or `tile`), and the page color behind it.

## Prompts that worked (Kling 4.0, image to video)

- **Van still on gold** (image edit of the real van still): "Cut this exact black van out of the street scene and place it in a seamless photo studio... entire background and floor one single flat solid golden yellow color... only a soft contact shadow under the van."
- **Arrival:** first frame = flat gold image, last frame = the van still on gold. "Locked-off static camera... van drives in from the left edge, travelling left to right, slows and comes to a gentle stop in the center... background stays the same flat golden yellow."
- **Door + push-in:** first frame = the van still on gold, no last frame. "Its large sliding side door glides smoothly open toward the rear... the camera pushes in toward the open doorway and through it."
- **Exploded mill:** first and last frame = a studio still of the mill. "The treadmill smoothly comes apart into a clean exploded view... parts float evenly spaced... then every part glides back and the machine reassembles."
- **Nap:** first frame = van with the door open, pup in the doorway, dog bed in the foreground. "The dog hops down, trots to the dog bed, turns one slow circle, flops down and falls asleep. Camera slowly pushes in."

## Rules
- Her real van and logo. Keep the subject in the center of the frame.
- Never show a dog forced, strapped in to run, or alone and stressed. Never show motorized treadmills.
- AI footage that shows Emelyn or a client's dog needs her OK before the page goes live.
