# Scroll-scene footage ("How it works")

The "How it works" section is a pinned, scroll-scrubbed scene. The footage is a set of still frames that the page steps through as the visitor scrolls (the same technique Apple uses on product pages). The engine is `js/scene.js`.

## What is here now

| Beat | Source | Files |
|---|---|---|
| Lap 1: we pull up to your curb | Kling clip B, shot 1 (door slides open, pup hops in) | `a-00` to `a-23` |
| Lap 2: warms up at their own pace | Real photo of Emelyn giving love pats | `pats` |
| Lap 3: a happy 30-minute workout | Kling clip B, shot 2 (pup trotting on the mill) | `b-00` to `b-24` |
| Pit stop: no motor | Kling clip B, shot 3 (both mills from above), then the SVG mill comes apart | `c-00` to `c-10` |
| Finish line: photo update + nap | Kling clip B, last frame (pup asleep) + SVG phone | `nap` |

Two sets, same names:
- `d/` desktop: 1280 x 660 WebP, about 2.6 MB total
- `m/` phone: 720 x 530 WebP (center crop of the same frames), about 1.4 MB total

Frames load only after the page has finished loading, a few at a time, first frame of each beat first.

## Swapping in a new clip

1. Export the clip from Kling **without the watermark**, 1080p or higher, 16:9.
2. Pull every 2nd frame (12 fps is plenty for scrubbing):
   ```
   ffmpeg -i new-clip.mp4 -vf "select='not(mod(n,2))',scale=1280:-2,crop=1280:660:0:0" -vsync 0 -start_number 0 -c:v libwebp -quality 62 d/a-%02d.webp
   ffmpeg -i new-clip.mp4 -vf "select='not(mod(n,2))',scale=1280:-2,crop=896:660:192:0,scale=720:530" -vsync 0 -start_number 0 -c:v libwebp -quality 56 m/a-%02d.webp
   ```
   Change `a` to the shot letter you are replacing. In the phone command, `192` is how far from the left the crop starts: move it so the subject stays in frame.
3. In `js/scene.js`, update the frame count in `SHOTS` (for example `a: 36`). To add a brand-new shot, add a letter to `SHOTS`, to the loading list in `startLoading`, and a line in `CHAPTERS` saying where on the scroll (0 to 1) it plays and which beat text shows.

## Shots still wanted (see START-HERE.md for prompts)

1. Van drives in from off-screen and parks at the curb.
2. One continuous push-in through the open side door to the mills.
3. Slow-motion close-up of the pup running, tongue flapping, slobber flying at the lens.
4. Photo-real slat mill coming apart and going back together.
5. Pup hops out, trots to a dog bed and flops down for a nap.

## Rules
- Her real van and logo. Keep the subject in the center 70 percent of the frame so the phone crop still works.
- Leave the top-left of the frame calm on desktop: the text card sits there.
- Never show a dog forced, strapped in to run, or alone and stressed.
- AI footage that shows Emelyn or a client's dog needs her OK before the page goes live.
