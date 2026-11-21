"""Speedy PawZ landing-page VSL, placeholder build (script v1.1).
Cuts Emelyn's own reel recordings into one 9:16 video with on-screen text cards, an original background
track (made here, so there is nothing to license) and a caption file.
Outputs: assets/video/intro.mp4 (1080x1920), intro-720.mp4, intro-poster.jpg, intro.vtt"""
import os, sys, json, subprocess, math, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

S = os.environ.get('SPZ_WORK', '/tmp/spz-vsl')          # working folder: source clips in $SPZ_WORK/drive/, renders in $SPZ_WORK/vsl/
P = os.environ.get('SPZ_SITE', os.path.dirname(os.path.dirname(os.path.abspath(__file__))))   # the site folder
D = S + '/drive/'
OUT = S + '/vsl'
SEG = OUT + '/seg'
CARD = OUT + '/cards'
for d in (SEG, CARD):
    os.makedirs(d, exist_ok=True)
W, H, FPS = 1080, 1920, 30
NAVY = (31, 27, 48); GOLD = (247, 179, 52); WHITE = (255, 255, 255); RED = (197, 51, 54)
F_DISP = P + '/assets/fonts/poppins-latin-800-normal.woff2'
F_DISP9 = P + '/assets/fonts/poppins-latin-900-normal.woff2'
F_BODY = P + '/assets/fonts/nunito-latin-800-normal.woff2'

SRC = {
    'G1': D + '1t4H7F-5g85WnvCxDX3eH8Zw9Z_Wsl3dV.mov', 'G2': D + '1C4Z973mDMjpsdguiWuGtdk0NlOZTf6Od.mov',
    'G3': D + '1LRmwxTRWIiYmelugoeh5Lc0YuV_S6hNM.mov', 'G5': D + '1SwqxmBdkEtW1TPcNBIWPIaqgd894s_SP.mov',
    'G6': D + '1JjEh-OrkHazK5dIe8y3r6j5QMS_C5S7V.mov', 'G7': D + '1s2QaloBIjoJyTkKFLo_6pnwKi5rx2s6G.mov',
    'C1': D + '1sAya6XNUIIHJwbpdRMj4ihf4SjCTLqkZ.mov', 'C2': D + '1DqhvfQvWIom3w55BRb62jRYGy-mFYVqS.mov',
    'D2': D + '1tFaz93wbHHuuz2nwTWI0v4S9yPBVIjXj.mov', 'D3': D + '1cXkzu5Q1DaMwHSzacRDBPAEwMSzGM2OK.mov',
    'D4': D + '1__M8XliqAkoqENo2z4ptkoTSoS3ZMtef.mov',
    'B': D + 'up_B.mov', 'E': D + 'up_E.mov', 'F': D + 'up_F.mov',
    'HUSKIES': P + '/assets/photos/huskies-on-the-mills.jpg', 'HEELER': P + '/assets/photos/heeler-and-emelyn-mill.jpg',
}
# crop boxes (x, y, w, h) inside each screen recording, chosen to leave out Instagram's buttons and handles
GBAND = (0, 528, 1320, 826)      # the landscape video inside the Kymber Halloween recording
DBAND = (0, 87, 1320, 515)       # the landscape video inside the Kymber session recording, above its captions
CR = {
    'G1P': (0, 50, 1135, 2018), 'BP': (25, 30, 1124, 1998), 'EP': (0, 12, 1135, 2018), 'EFACE': (335, 0, 650, 1155),
    'C1DEL': (250, 0, 820, 1458), 'C1TAIL': (300, 0, 820, 1458), 'C2EM': (320, 0, 723, 1286), 'C2REP': (250, 0, 820, 1458),
    'FTROT': (360, 0, 789, 1403), 'FNAP': (0, 0, 1135, 2018), 'G5TREAT': (0, 40, 1135, 2018),
}

# id, source, in, out, layout (portrait | band | still | card), crop, keep source audio, text cards [(text, t0, t1)], extra
GZ = {'z': 1.25}
EDL = [
    # HOOK: Emelyn's own reel opening, her caption boxes and her voice ("Are you excited?")
    ('hook1', 'G1', 1.0, 3.6, 'portrait', 'G1P', True, [], {}),
    ('hook2', 'G1', 4.2, 5.8, 'portrait', 'G1P', True, [], {}),
    ('hook3', 'G1', 8.0, 10.0, 'portrait', 'G1P', True, [], {}),
    # INTRO
    ('intro', 'C2', 4.2, 8.8, 'portrait', 'C2EM', False, [("Hi! I'm *Emelyn*.", 0, 2.2), ("I'd love to be part of your *pup's care team*.", 2.2, 4.6)],
     {'lower': ('Emelyn Hernandez', 'Founder, Speedy PawZ  ·  Woodland, CA', 0.3, 4.6)}),
    ('slippers', 'D4', 5.2, 8.4, 'band', DBAND, False, [("And maybe save your next pair of *slippers*.", 0, 3.2)], {'z': 1.3, 'fx': 0.35}),
    # WHY SHE STARTED
    ('why1', 'HUSKIES', 0, 5.4, 'still', None, False, [("It all started with my huskies, *Kira and Kiko*.", 0, 2.6),
                                                     ("Huskies are made to *run*. Some days a walk just wasn't enough.", 2.6, 5.4)], {}),
    ('why2', 'E', 6.2, 9.4, 'band', (0, 0, 1320, 1180), False, [("Too hot. Too smoky. Or I was just *wiped out* after work.", 0, 3.2)], {}),
    ('why3', 'G7', 0.5, 3.3, 'band', GBAND, False, [("So I built a *gym on wheels*.", 0, 2.8)], GZ),
    # HOW IT WORKS 1: curb, van, space
    ('how1', 'D2', 0.3, 4.0, 'band', DBAND, False, [("I pull up right to *your curb*.", 0, 3.7)], {'z': 1.35, 'fx': 0.12}),
    ('how2', 'G2', 13.0, 15.5, 'band', GBAND, False, [("Straight in. *No hesitation.*", 0, 2.5)], GZ),
    ('how3', 'E', 0.1, 2.6, 'band', (0, 260, 1320, 1200), False, [("Climate-controlled. *Lots of windows.* Plenty of room.", 0, 2.5)], {}),
    # HOW IT WORKS 2: coaching and safety
    ('coach1', 'G3', 6.0, 9.0, 'band', GBAND, False, [("30 minutes, *one-on-one*. I'm right by their side.", 0, 3.0)], GZ),
    ('coach2', 'G5', 0.5, 3.5, 'band', GBAND, False, [("*No motor.* The belt only moves when your dog does.", 0, 3.0)], GZ),
    ('coach3', 'D3', 0.3, 3.6, 'band', DBAND, False, [("Praise, toys and *treats*.", 0, 3.3)], {'z': 1.3, 'fx': 0.55}),
    ('coach4', 'G5', 7.4, 10.4, 'portrait', 'G5TREAT', False, [], {}),      # her caption: "Treats & breaks, at her pace"
    # WILL MY DOG GET ON IT? Emelyn's own words, then proof
    ('will1', 'B', 0.0, 13.9, 'portrait', 'BP', True, [("Will my dog actually *get on it?*", 0, 3.6)], {}),
    ('will2', 'C1', 1.2, 5.0, 'portrait', 'C1DEL', False, [("Delilah's first time: she *started moving*.", 0, 3.8)], {}),
    ('will3', 'C1', 11.2, 14.0, 'portrait', 'C1TAIL', False, [("Happy *tail wags!*", 0, 2.8)], {}),
    ('will4', 'C2', 0.0, 3.0, 'portrait', 'C2REP', False, [("Not every dog steps right on. *We go slow.*", 0, 3.0)], {}),
    # PROOF + PAYOFF
    ('proof1', 'F', 0.2, 4.6, 'portrait', 'FTROT', True, [("After a good run...", 0.4, 4.4)], {}),
    ('proof2', 'F', 9.0, 10.4, 'portrait', 'FNAP', False, [("Plus a *photo update* after every session.", 0.2, 3.8)], {'hold': 2.4}),
    # WHO IT'S FOR
    ('who1', 'HEELER', 0, 3.5, 'still', None, False, [("Not instead of your walks. The *run* a walk can't always give.", 0, 3.5)], {}),
    ('who2', 'G6', 0.5, 3.5, 'band', GBAND, False, [("For dogs who *love to run*, seniors and shy pups.", 0, 3.0)], GZ),
    # CTA
    ('cta', None, 0, 8.0, 'card', None, False, [], {}),
]

# lines spoken in the clips we keep audio for (for the caption file); times are inside the segment
SPOKEN = {
    'hook2': [("Are you excited?", 0.1, 1.6)],
    'will1': [("I want to show how the slat mills are a tool to be able to train all kinds of dogs.", 0.0, 4.6),
              ("Little dogs, big dogs, old dogs.", 4.6, 8.4),
              ("And how even when it's not the right fit, it's still an enrichment activity.", 8.4, 13.9)],
    'proof1': [("Come on, Kymber!", 0.6, 4.4)],
}


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(' '.join(cmd[:12]), '...'); print(r.stderr[-1500:]); sys.exit(1)
    return r


# ---------------- text cards ----------------
def font(path, size):
    return ImageFont.truetype(path, size)


def parse(text):
    """'Hi *there* you' -> [(word, gold?), ...]"""
    out, gold = [], False
    for part in text.split('*'):
        for w in part.split():
            if out and all(c in '.,!?:;' for c in w):
                out[-1] = (out[-1][0], out[-1][1], w)       # trailing punctuation rides on the previous word, in white
            else:
                out.append((w, gold, ''))
        gold = not gold
    return out


def text_box(text, size=64, maxw=900, pad=(40, 26), radius=30):
    f = font(F_DISP, size)
    words = parse(text)
    space = f.getlength(' ')
    lines, cur, curw = [], [], 0
    for w, g, tail in words:
        ww = f.getlength(w + tail)
        if cur and curw + space + ww > maxw:
            lines.append((cur, curw)); cur, curw = [], 0
        curw = curw + (space if cur else 0) + ww
        cur.append((w, g, ww, tail))
    if cur:
        lines.append((cur, curw))
    lh = int(size * 1.2)
    bw = int(max(l[1] for l in lines) + pad[0] * 2)
    bh = int(lh * len(lines) + pad[1] * 2 + size * 0.12)
    im = Image.new('RGBA', (bw + 40, bh + 40), (0, 0, 0, 0))
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((20, 26, 20 + bw, 26 + bh), radius, fill=(0, 0, 0, 110))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(10)))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((20, 20, 20 + bw, 20 + bh), radius, fill=NAVY + (240,))
    y = 20 + pad[1]
    for words_, lw in lines:
        x = 20 + (bw - lw) / 2
        for w, g, ww, tail in words_:
            d.text((x, y), w, font=f, fill=GOLD if g else WHITE)
            if tail:
                d.text((x + f.getlength(w), y), tail, font=f, fill=WHITE)
            x += ww + space
        y += lh
    return im


def lower_third(name, sub):
    f1, f2 = font(F_DISP, 50), font(F_BODY, 34)
    bw = int(max(f1.getlength(name), f2.getlength(sub)) + 70)
    bh = 128
    im = Image.new('RGBA', (bw + 30, bh + 30), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((10, 10, 10 + bw, 10 + bh), 24, fill=NAVY + (240,))
    d.rounded_rectangle((10, 10, 22, 10 + bh), 6, fill=GOLD + (255,))
    d.text((44, 22), name, font=f1, fill=WHITE)
    d.text((44, 84), sub, font=f2, fill=GOLD)
    return im


def place(card, cy, x=None):
    """full-frame transparent overlay with the card centered at height cy"""
    full = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    cx = (W - card.width) // 2 if x is None else x
    full.alpha_composite(card, (int(cx), int(cy - card.height / 2)))
    return full


def cta_card():
    im = Image.new('RGB', (W, H), NAVY)
    d = ImageDraw.Draw(im)
    # checker strip top and bottom
    for y0 in (0, H - 36):
        for i in range(0, W, 36):
            for r in range(2):
                if ((i // 36) + r) % 2 == 0:
                    d.rectangle((i, y0 + r * 18, i + 35, y0 + r * 18 + 17), fill=(18, 17, 23))
                else:
                    d.rectangle((i, y0 + r * 18, i + 35, y0 + r * 18 + 17), fill=(246, 238, 222))
    logo = Image.open(P + '/assets/logo/speedypawz-logo-badge-512.png').convert('RGBA').resize((400, 400), Image.LANCZOS)
    im.paste(logo, ((W - 400) // 2, 190), logo)
    def center(t, f, y, fill):
        d.text(((W - f.getlength(t)) / 2, y), t, font=f, fill=fill)
    center('Ready for a happier pup?', font(F_DISP, 70), 660, WHITE)
    # the button
    bf = font(F_DISP, 54)
    lab1, lab2 = 'Request my pup\'s', 'first session'
    bw, bh = 860, 230
    bx, by = (W - bw) // 2, 800
    d.rounded_rectangle((bx, by + 12, bx + bw, by + bh + 12), 115, fill=(140, 30, 36))
    d.rounded_rectangle((bx, by, bx + bw, by + bh), 115, fill=RED)
    center(lab1, bf, by + 44, WHITE); center(lab2, bf, by + 112, WHITE)
    # arrow pointing down to the page button
    ax, ay = W // 2, 1100
    d.polygon([(ax - 46, ay), (ax + 46, ay), (ax, ay + 52)], fill=GOLD)
    body = font(F_BODY, 42)
    center('Tap the button under this video.', body, 1190, WHITE)
    center('Takes about a minute. Emelyn texts you', body, 1250, WHITE)
    center('to pick a time.', body, 1310, WHITE)
    center('Woodland  ·  Davis  ·  Sacramento  ·  Yolo County', font(F_BODY, 38), 1440, GOLD)
    center('(530) 808-5782', font(F_DISP, 60), 1510, WHITE)
    center('Happy PawZ, Healthy Strides!', font(F_DISP, 48), 1660, GOLD)
    return im


# ---------------- segments ----------------
def band_top(crop, extra=None):
    w, h = crop[2], crop[3]
    z = (extra or {}).get('z', 1.0)
    fh = round(W * z * h / w / 2) * 2
    cy = 1080
    return cy - fh / 2, fh, cy


def build_segment(i, seg):
    sid, src, t0, t1, layout, crop, keep_audio, texts, extra = seg
    dur = t1 - t0
    hold = extra.get('hold', 0)
    total = dur + hold
    out = f'{SEG}/{i:02d}-{sid}.mp4'
    inputs, fc = [], []
    # --- picture
    if layout == 'card':
        cta_card().save(f'{CARD}/cta.png')
        inputs += ['-loop', '1', '-framerate', str(FPS), '-t', f'{total:.3f}', '-i', f'{CARD}/cta.png']
        fc.append(f"[0:v]scale=w='{W}*(1+0.035*t/{total:.3f})':h=-2:eval=frame,crop={W}:{H},setsar=1,fps={FPS},format=yuv420p[base]")
        text_cy = None
    elif layout == 'still':
        im = Image.open(SRC[src]).convert('RGB')
        inputs += ['-loop', '1', '-framerate', str(FPS), '-t', f'{total:.3f}', '-i', SRC[src]]
        fh = round(W * im.height / im.width / 2) * 2
        cy = 1060
        fc.append(f"[0:v]split[a][b];[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},boxblur=36:2,eq=brightness=-0.14:saturation=0.85[bg];"
                  f"[b]scale=w='{W}*(1+0.06*t/{total:.3f})':h=-2:eval=frame[fg];[bg][fg]overlay=x='(W-w)/2':y='{cy}-h/2',setsar=1,fps={FPS},format=yuv420p[base]")
        text_cy = max(230, (cy - fh / 2) / 2 + 20)
    else:
        inputs += ['-ss', f'{t0:.3f}', '-t', f'{dur:.3f}', '-i', SRC[src]]
        if layout == 'portrait':
            x, y, w, h = CR[crop]
            fc.append(f"[0:v]crop={w}:{h}:{x}:{y},scale={W}:{H}:flags=lanczos,setsar=1,fps={FPS},format=yuv420p" +
                      (f",tpad=stop_mode=clone:stop_duration={hold}" if hold else '') + "[base]")
            text_cy = 330
        else:  # band
            x, y, w, h = crop
            top, fh, cy = band_top(crop, extra)
            z, fx = extra.get('z', 1.0), extra.get('fx', 0.5)
            zw = round(W * z / 2) * 2
            fc.append(f"[0:v]crop={w}:{h}:{x}:{y},split[a][b];[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},boxblur=40:2,eq=brightness=-0.16:saturation=0.85[bg];"
                      f"[b]scale={zw}:{fh}:flags=lanczos,crop={W}:{fh}:{int((zw - W) * fx)}:0[fg];[bg][fg]overlay=0:{int(top)},setsar=1,fps={FPS},format=yuv420p[base]")
            text_cy = max(250, top / 2 + 10)
    # --- overlays
    last = 'base'
    k = len([a for a in inputs if a == '-i'])
    ovs = []
    for j, (tx, a, b) in enumerate(texts):
        png = f'{CARD}/{sid}-{j}.png'
        place(text_box(tx), text_cy).save(png)
        ovs.append((png, a, min(b, total)))
    if 'lower' in extra:
        name, sub, a, b = extra['lower']
        png = f'{CARD}/{sid}-lower.png'
        lt = lower_third(name, sub)
        place(lt, 1500, x=54).save(png)
        ovs.append((png, a, b))
    for png, a, b in ovs:
        inputs += ['-loop', '1', '-framerate', str(FPS), '-t', f'{total:.3f}', '-i', png]
        fd = 0.18
        fc.append(f"[{k}:v]format=rgba,fade=t=in:st={a:.2f}:d={fd}:alpha=1,fade=t=out:st={max(a, b - fd):.2f}:d={fd}:alpha=1[o{k}];"
                  f"[{last}][o{k}]overlay=0:0:enable='between(t,{a:.2f},{b:.2f})'[v{k}]")
        last = f'v{k}'; k += 1
    # --- sound: the clip's own audio where Emelyn speaks, silence elsewhere
    if keep_audio:
        fc.append(f"[0:a]aresample=48000,aformat=channel_layouts=stereo,highpass=f=70,volume={GAIN.get(src, 1.0):.3f},apad=whole_dur={total:.3f},atrim=0:{total:.3f}[aud]")
    else:
        inputs += ['-f', 'lavfi', '-t', f'{total:.3f}', '-i', 'anullsrc=r=48000:cl=stereo']
        fc.append(f"[{k}:a]anull[aud]"); k += 1
    run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(fc), '-map', f'[{last}]', '-map', '[aud]',
         '-t', f'{total:.3f}', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', str(FPS),
         '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', out])
    return out, total


# voice level: bring each speaking clip to about the same loudness
def mean_db(path, t0=None, t1=None):
    cmd = ['ffmpeg', '-v', 'info']
    if t0 is not None:
        cmd += ['-ss', str(t0), '-t', str(t1 - t0)]
    cmd += ['-i', path, '-af', 'volumedetect', '-f', 'null', '-']
    r = subprocess.run(cmd, capture_output=True, text=True).stderr
    for l in r.splitlines():
        if 'mean_volume' in l:
            return float(l.split(':')[1].split()[0])
    return -30.0


GAIN = {}
for s in ('G1', 'B', 'F'):
    m = mean_db(SRC[s])
    GAIN[s] = 10 ** ((-20.0 - m) / 20)
print('voice gains', {k: round(v, 2) for k, v in GAIN.items()})


# ---------------- music: an original, simple, warm groove (made here, nothing to license) ----------------
def make_music(total, ducks, path):
    sr = 48000
    n = int(total * sr) + sr
    mix = np.zeros(n)
    bpm = 100.0
    beat = 60 / bpm
    bar = beat * 4
    rng = np.random.default_rng(7)

    def add(sig, t, gain=1.0):
        i = int(t * sr)
        if i >= n:
            return
        j = min(n, i + len(sig))
        mix[i:j] += sig[:j - i] * gain

    def pluck(f, dur=1.4):
        t = np.arange(int(dur * sr)) / sr
        s = sum((1 / k ** 1.25) * np.sin(2 * np.pi * k * f * t) * np.exp(-t * (2.6 + 2.2 * k)) for k in range(1, 7))
        att = np.minimum(1, t / 0.004)
        return s * att

    def bassn(f, dur=0.9):
        t = np.arange(int(dur * sr)) / sr
        s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
        return s * np.minimum(1, t / 0.012) * np.exp(-t * 2.6)

    def kick():
        t = np.arange(int(0.32 * sr)) / sr
        fr = 45 + 75 * np.exp(-t * 28)
        ph = 2 * np.pi * np.cumsum(fr) / sr
        return np.sin(ph) * np.exp(-t * 14)

    def noise_hit(dur, decay, hp=True):
        x = rng.standard_normal(int(dur * sr))
        if hp:
            x = np.diff(x, prepend=0)
        t = np.arange(len(x)) / sr
        return x * np.exp(-t * decay)

    def pad(freqs, dur):
        t = np.arange(int(dur * sr)) / sr
        s = sum(np.sin(2 * np.pi * f * t * (1 + d)) for f in freqs for d in (-0.0018, 0.0018))
        env = np.minimum(1, t / 0.5) * np.minimum(1, (dur - t) / 0.5)
        return s * env

    C3, D3_, E3, F3, G3_, A3, B3 = 130.81, 146.83, 164.81, 174.61, 196.0, 220.0, 246.94
    C4, D4_, E4, F4, G4, A4 = 261.63, 293.66, 329.63, 349.23, 392.0, 440.0
    C5, D5, E5, G5, A5 = 523.25, 587.33, 659.25, 783.99, 880.0
    prog = [  # (bass root, chord tones)
        (C3, [C4, E4, G4]), (G3_ / 2 * 2 / 2 * 2, [B3, D4_, G4]), (A3 / 2 * 2 / 2 * 2, [A3, C4, E4]), (F3, [A3, C4, F4]),
    ]
    prog[1] = (98.0, [B3, D4_, G4]); prog[2] = (110.0, [A3, C4, E4]); prog[3] = (87.31, [A3, C4, F4])
    melody = [(0, E5), (0.75, G5), (1.5, A5), (2.5, G5), (4, E5), (4.75, D5), (5.5, C5), (6.5, D5)]  # beats within 2 bars
    nbars = int(math.ceil(total / bar)) + 1
    for b in range(nbars):
        t0 = b * bar
        root, tones = prog[b % 4]
        add(pad([f / 2 for f in tones], bar + 0.4), t0, 0.035)
        for hit, vel in ((0, 1.0), (1.5, 0.75), (2, 0.9), (3.5, 0.75)):
            for m, f in enumerate(tones):
                add(pluck(f), t0 + hit * beat + m * 0.018, 0.11 * vel)
        if b >= 2:
            add(bassn(root), t0, 0.32); add(bassn(root), t0 + 2 * beat, 0.26); add(bassn(root * 1.5), t0 + 3.5 * beat, 0.16)
            for k in (0, 2):
                add(kick(), t0 + k * beat, 0.42)
            for k in (1, 3):
                add(noise_hit(0.18, 34), t0 + k * beat, 0.05)
            for e in range(8):
                add(noise_hit(0.06, 70), t0 + e * beat / 2 + (0.02 if e % 2 else 0), 0.018 if e % 2 else 0.012)
        if b >= 4 and (b // 2) % 2 == 1 and b % 2 == 0:
            for bt, f in melody:
                add(pluck(f, 1.0), t0 + bt * beat, 0.07)
    mix = mix[:int(total * sr)]
    mix = np.tanh(mix * 1.2) / 1.2
    mix /= np.max(np.abs(mix)) + 1e-9
    mix *= 0.30
    t = np.arange(len(mix)) / sr
    env = np.ones_like(mix)
    for a, b, g in ducks:
        r = 0.35
        seg = np.clip(np.minimum((t - (a - r)) / r, ((b + r) - t) / r), 0, 1)
        env = np.minimum(env, 1 - (1 - g) * seg)
    env *= np.minimum(1, t / 0.6) * np.minimum(1, (total - t) / 2.6)
    mix *= env
    st = np.stack([mix, mix * 0.98], 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype('<i2').tobytes())


# ---------------- build ----------------
def vtt_time(x):
    h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f'{h:02d}:{m:02d}:{s:06.3f}'


only = sys.argv[1:]
segfiles, cues, ducks, t = [], [], [], 0.0
for i, seg in enumerate(EDL):
    sid = seg[0]
    path = f'{SEG}/{i:02d}-{sid}.mp4'
    if not only or sid in only or not os.path.exists(path):
        path, dur = build_segment(i, seg)
        print('built', os.path.basename(path), round(dur, 2))
    dur = seg[3] - seg[2] + seg[8].get('hold', 0)
    for tx, a, b in seg[7]:
        cues.append((t + a, t + min(b, dur), tx.replace('*', '')))
    for tx, a, b in SPOKEN.get(sid, []):
        cues.append((t + a, t + b, tx))
    if seg[6]:
        ducks.append((t, t + dur, 0.22 if sid.startswith('will') else 0.4))
    segfiles.append(path)
    t += dur
total = t
print('total', round(total, 2))
cues.append((total - 8.0, total, "Request my pup's first session. Tap the button under this video. Takes about a minute."))
cues.sort()

with open(f'{OUT}/list.txt', 'w') as fl:
    for p in segfiles:
        fl.write(f"file '{p}'\n")
run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{OUT}/list.txt', '-c', 'copy', f'{OUT}/joined.mp4'])
make_music(total, ducks, f'{OUT}/music.wav')
mixf = "[0:a][1:a]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.89[a]"
os.makedirs(P + '/assets/video', exist_ok=True)
run(['ffmpeg', '-v', 'error', '-y', '-i', f'{OUT}/joined.mp4', '-i', f'{OUT}/music.wav', '-filter_complex', mixf, '-map', '0:v', '-map', '[a]',
     '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', f'{OUT}/mixed.mov'])

def two_pass(src, dst, vf, kbps, akbps):
    log = f'{OUT}/x264pass'
    common = ['-vf', vf, '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-b:v', f'{kbps}k', '-maxrate', f'{int(kbps * 1.6)}k',
              '-bufsize', f'{kbps * 3}k', '-pix_fmt', 'yuv420p', '-passlogfile', log]
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, *common, '-pass', '1', '-an', '-f', 'mp4', '/dev/null'])
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, *common, '-pass', '2', '-c:a', 'aac', '-b:a', f'{akbps}k', '-movflags', '+faststart', dst])

two_pass(f'{OUT}/mixed.mov', P + '/assets/video/intro.mp4', 'null', 1500, 128)
two_pass(f'{OUT}/mixed.mov', P + '/assets/video/intro-720.mp4', 'scale=720:1280:flags=lanczos', 560, 96)
# poster: Emelyn smiling at the start of the intro, with a play hint drawn on
intro_start = sum(e[3] - e[2] + e[8].get('hold', 0) for e in EDL[:3])
run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{intro_start + 2.6:.2f}', '-i', P + '/assets/video/intro.mp4', '-frames:v', '1', f'{OUT}/poster.png'])
Image.open(f'{OUT}/poster.png').convert('RGB').resize((720, 1280), Image.LANCZOS).save(P + '/assets/video/intro-poster.jpg', quality=82, optimize=True, progressive=True)
with open(P + '/assets/video/intro.vtt', 'w') as fv:
    fv.write('WEBVTT\n\n')
    for k, (a, b, tx) in enumerate(cues, 1):
        fv.write(f'{k}\n{vtt_time(a)} --> {vtt_time(b)}\n{tx}\n\n')
for f in ('intro.mp4', 'intro-720.mp4', 'intro-poster.jpg', 'intro.vtt'):
    print(f, os.path.getsize(P + '/assets/video/' + f) // 1024, 'KB')
json.dump({'total': total, 'ducks': ducks}, open(f'{OUT}/meta.json', 'w'))
