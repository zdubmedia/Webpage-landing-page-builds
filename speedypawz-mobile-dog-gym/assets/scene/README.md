# "How it works" lap films

The "How it works" section is five laps stacked down the page. Each lap has a short film that starts by itself once its picture has scrolled onto the screen, and plays through even if the visitor stops scrolling. The engine is `js/scene.js`.

Each film exists twice:
- `film/<name>.mp4` (and `<name>-m.mp4`, a smaller one for phones): the video. Smoothest, used whenever the browser lets a video start on its own.
- `seq/<name>/000.webp ...`: the same film as still frames, played on a canvas. Used where the browser refuses to autoplay video (iPhone Low Power Mode), so nobody ever gets a play button.

## What is here now

| Lap | Video / frame folder | Frames | What happens | Source | Look |
|---|---|---|---|---|---|
| Lap 1 | `1-van` / `van` | 108 | Van drives in from the left edge of the page and parks, the side door slides open, the camera pushes to the doorway | Kling 4.0, gold studio (two clips joined) | seamless, on the gold page |
| Lap 2 | `2-warmup` / `warmup` | 60 | Emelyn clips the harness on, love pats, a treat | Zach's Kling clip | tile |
| Lap 3 | `3-trot` / `trot` | 60 | Happy slow-motion trot, tongue flapping, no saliva | Zach's Kling clip | tile |
| Pit stop | `4-mill` / `mill` | 72 | Slat mill comes apart and goes back together | Kling 4.0, from a studio still of her real mill | seamless on phones, tile on desktop |
| Finish line | `5-nap` / `nap` | 84 | Pup hops out, curls up on a dog bed, falls asleep | Kling 4.0 | tile |

Videos: about 2.3 MB for a phone, 4.3 MB for a desktop. Frame folders: about 5 MB, 640 pixels wide, only downloaded by phones that refuse the video. Nothing loads until the page itself has finished loading; then each film loads when its lap is about a screen away.

Lap 1 and the Finish line play once and rest on their last frame. Lap 2, Lap 3 and the Pit stop loop. That is set with `data-play` on each lap's picture box in `index.html`.

`nap-still.webp` is one frame of the nap, used as a sticker in the big "zoomies / snoozies" band.

**"Seamless"** means the subject sits on one flat background color and the page behind it is the same color, so the van reads as rolling across the page itself. The van film's background was set to exact brand gold `#F7B334`.

**Push-in note:** the push-in is cut at 3.75 s on purpose. After that point Kling drew ordinary motorized-looking treadmills inside the van, which is wrong for a "no motor" business.

**Lap 2 note:** Zach's clip has Instagram caption text burned into the lower part of the frame and a Kling watermark, so the bottom of the frame is cropped off.

## Swapping in a new clip

1. Export the clip without a watermark, 16:9, about 5 to 7 seconds.
2. Make the videos (no sound, 24 frames a second) and the frame folder (12 frames a second; the van uses 15). **Use new names** (for example `3-trot2`, `trot2`): files in `/assets` are cached by browsers for a year, so overwriting an old name will not reach people who already visited.
   ```
   # desktop video
   ffmpeg -i clip.mp4 -an -vf "fps=24,scale=1280:720" -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart film/3-trot2.mp4
   # phone video, tile lap (137 = how far from the left the crop starts, 0 to 304)
   ffmpeg -i clip.mp4 -an -vf "fps=24,scale=1280:720,crop=976:720:137:0,scale=640:472" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart film/3-trot2-m.mp4
   # frame folder, made from the phone video so both show the same thing
   ffmpeg -i film/3-trot2-m.mp4 -vf "fps=12,scale=640:472" -start_number 0 -c:v libwebp -quality 46 seq/trot2/%03d.webp
   ```
   A seamless lap (van, mill) keeps the whole frame: 854 x 480 for the phone video, 640 x 360 for the frames.
3. In `index.html`, find that lap's picture box (`<div class="lap__media" ... data-film="assets/scene/film/3-trot" ...>`) and set `data-film`, `data-film-m`, `data-seq`, and `data-n` (how many frames are in the folder). Point the still picture (`<img class="lap__poster">`) at one good frame from the new folder.
4. For a gold seamless film, the gold in the clip will not be exactly brand gold. Shift the background to `#F7B334` (any video tool with a color replace limited to the background). Without this you get a faint box around the film.

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
