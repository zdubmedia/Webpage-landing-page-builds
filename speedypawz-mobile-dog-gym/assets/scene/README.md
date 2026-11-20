# Scroll-scene footage ("How it works")

The "How it works" section is a pinned, scroll-scrubbed scene. The footage is a set of still frames that the page steps through as the visitor scrolls (the same technique Apple uses on product pages). The engine is `js/scene.js`.

## What is here now

| Beat | Shot | Source | Files |
|---|---|---|---|
| Lap 1: we pull up to your curb | Van drives in from off-screen and parks | Kling 4.0, 1080p, made in this build | `v-00` to `v-28` |
| Lap 1 (continued) | Side door slides open, pup hops in | Zach's Kling clip, 720p | `a-00` to `a-23` |
| Lap 2: warms up at their own pace | Emelyn giving love pats | Real photo | `pats` |
| Lap 3: a happy 30-minute workout | Slow-motion run, tongue flapping, slobber hits the lens | Kling 4.0, 1080p | `s-00` to `s-38` |
| Pit stop: no motor | Slat mill comes apart and goes back together | Kling 4.0, 1080p, from a studio still of her real mill | `x-00` to `x-47` |
| Finish line: tired, happy pup | Pup hops out, curls up on a dog bed, falls asleep | Kling 4.0, 1080p | `n-00` to `n-55` |

Two sets, same names:
- `d/` desktop: 1280 x 720 WebP, about 7.6 MB total
- `m/` phone: 640 x 472 WebP (a 4:3-ish crop of the same frames), about 3.8 MB total

Nothing here loads until the page itself has finished loading. Then the scene loads one beat ahead of where the visitor is, a few frames at a time.

All Kling 4.0 clips were downloaded without a watermark. The source clips (1080p MP4) are in Zach's Kling account history.

## Swapping in a new clip

1. Generate or export the clip without a watermark, 1080p, 16:9.
2. Pull 8 frames per second:
   ```
   ffmpeg -i clip.mp4 -vf "fps=8,scale=1280:720" -start_number 0 -c:v libwebp -quality 56 d/p-%02d.webp
   ffmpeg -i clip.mp4 -vf "fps=8,scale=1280:720,crop=976:720:152:0,scale=640:472" -start_number 0 -c:v libwebp -quality 52 m/p-%02d.webp
   ```
   `p` is the shot letter. In the phone command, `152` is how far from the left the crop starts (0 to 304): move it so the subject stays in frame.
3. In `js/scene.js`: add the letter and frame count to `SHOTS`, and point a line in `CHAPTERS` at it (where on the 0 to 1 scroll it plays, and which beat text shows).

## Still wanted

- **Door + push-in (one continuous shot):** the side door slides open and the camera pushes through the doorway to the two mills. A Kling job for this stalled during the build. When it exists, it replaces shot `a` (the only 720p shot left). Prompt and reference frames are in START-HERE.md.

## Rules
- Her real van and logo. Keep the subject in the center 75 percent of the frame so the phone crop still works.
- Leave the top-left of the frame calm on desktop: the text card sits there.
- Never show a dog forced, strapped in to run, or alone and stressed.
- AI footage that shows Emelyn or a client's dog needs her OK before the page goes live.
