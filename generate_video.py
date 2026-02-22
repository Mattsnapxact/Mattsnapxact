#!/usr/bin/env python3
"""
SNAPXACT — Cinematic Product Promo Video Generator
1080x1920 vertical | 30 seconds | 24fps
Colour palette: #0a0a0a | #f5f2ed | #e8f542
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import subprocess, os, sys, math, random, struct, wave, io

# ── Constants ─────────────────────────────────────────────────────────────────
W, H, FPS = 1080, 1920, 24
TOTAL     = 30 * FPS          # 720 frames

BG     = (10, 10, 10)         # #0a0a0a  deep charcoal
FG     = (245, 242, 237)      # #f5f2ed  warm off-white
ACCENT = (232, 245, 66)       # #e8f542  electric lime-yellow

# Scene boundaries (frames)
S = {
    'problem':  (0,               4 * FPS),   #   0 –  95
    'corridor': (4  * FPS,        9 * FPS),   #  96 – 215
    'moment':   (9  * FPS,       14 * FPS),   # 216 – 335
    'magic':    (14 * FPS,       18 * FPS),   # 336 – 431
    'payoff':   (18 * FPS,       23 * FPS),   # 432 – 551
    'relief':   (23 * FPS,       27 * FPS),   # 552 – 647
    'endcard':  (27 * FPS,       30 * FPS),   # 648 – 719
}

FONT_BOLD  = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG   = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_MONO  = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
FONT_MONO_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

# ── Helpers ───────────────────────────────────────────────────────────────────
def lerp(a, b, t):          return a + (b - a) * t
def clamp(v, lo, hi):       return max(lo, min(hi, v))
def ease_in_out(t):         return t * t * (3 - 2 * t)
def ease_out(t):            return 1 - (1 - t) ** 3
def ease_in(t):             return t * t

rng = random.Random(42)

def font(path, size):
    try:    return ImageFont.truetype(path, size)
    except: return ImageFont.load_default()

def add_grain(arr, strength=0.04):
    noise = np.random.randn(arr.shape[0], arr.shape[1]) * strength * 255
    out   = arr.astype(np.float32)
    out[:,:,:3] += noise[:,:, np.newaxis]
    return np.clip(out, 0, 255).astype(np.uint8)

def vignette(arr, strength=0.55):
    y, x  = np.mgrid[0:H, 0:W]
    dist  = np.sqrt(((x - W/2)/(W*0.55))**2 + ((y - H/2)/(H*0.55))**2)
    vig   = np.clip(1.0 - dist * strength, 0, 1)
    out   = arr.astype(np.float32)
    out[:,:,:3] *= vig[:,:, np.newaxis]
    return np.clip(out, 0, 255).astype(np.uint8)

def color_grade(img_arr, r_mul=1.0, g_mul=1.0, b_mul=1.0, contrast=1.0, brightness=0.0):
    f = img_arr.astype(np.float32) / 255.0
    f[:,:,0] *= r_mul
    f[:,:,1] *= g_mul
    f[:,:,2] *= b_mul
    f[:,:,:3] = (f[:,:,:3] - 0.5) * contrast + 0.5 + brightness
    return np.clip(f * 255, 0, 255).astype(np.uint8)

def halation(img, radius=8, strength=0.25):
    """Bright areas bleed slightly — film halation."""
    bright = img.point(lambda p: p if p > 200 else 0)
    glow   = bright.filter(ImageFilter.GaussianBlur(radius))
    return Image.blend(img, glow, strength)

def draw_text_centered(draw, text, y, font_obj, fill, shadow=True):
    bbox = draw.textbbox((0, 0), text, font=font_obj)
    tw   = bbox[2] - bbox[0]
    x    = (W - tw) // 2
    if shadow:
        draw.text((x+2, y+2), text, font=font_obj, fill=(0,0,0,120))
    draw.text((x, y), text, font=font_obj, fill=fill)
    return tw

def scene_t(frame, scene_key):
    """Normalised [0,1] time within a scene."""
    lo, hi = S[scene_key]
    return clamp((frame - lo) / max(hi - lo - 1, 1), 0.0, 1.0)


# ── Scene 1 — THE PROBLEM (0:00–0:04) ────────────────────────────────────────
def render_problem(frame):
    t  = scene_t(frame, 'problem')
    et = ease_in_out(t)

    img  = Image.new('RGBA', (W, H), (28, 24, 18, 255))
    draw = ImageDraw.Draw(img)

    # Fluorescent light gradient — cold top, warmer bottom
    for yy in range(0, H, 4):
        bright = int(lerp(18, 10, yy/H))
        tint_g = int(lerp(2, 0, yy/H))
        draw.rectangle([0, yy, W, yy+4], fill=(bright, bright+tint_g, bright, 255))

    # Slow zoom: scale up crop window
    zoom   = lerp(1.0, 1.18, et)
    canvas = int(W * zoom)
    cH     = int(H * zoom)
    zoomed = Image.new('RGBA', (canvas, cH), (22, 20, 15, 255))
    zd     = ImageDraw.Draw(zoomed)

    # ── Manila folder ──
    fx, fy  = int(canvas * 0.12), int(cH * 0.30)
    fw, fh  = int(canvas * 0.76), int(cH * 0.52)
    # Folder body
    zd.rectangle([fx, fy, fx+fw, fy+fh], fill=(180, 140, 70, 255), outline=(140, 105, 45, 255), width=3)
    # Folder tab
    zd.rectangle([fx+20, fy-28, fx+180, fy+2], fill=(160, 122, 55, 255))
    # Paper sheets sticking out top
    for i, offset in enumerate([8, 22, -12]):
        px = fx + 18 + offset
        py = fy - 55 - i*8
        zd.rectangle([px, py, px + fw - 40, fy + 10], fill=(240, 238, 230, 255), outline=(210, 208, 200, 255))
        # Ruled lines on paper
        for row in range(6):
            ly = py + 18 + row * 10
            zd.rectangle([px+12, ly, px+fw-55, ly+1], fill=(190, 188, 182, 255))
        # Faint spreadsheet column grid
        for col in range(4):
            cx2 = px + 12 + col * int((fw-60)/4)
            zd.rectangle([cx2, py+8, cx2+1, fy+8], fill=(200, 198, 192, 255))

    # Sticky notes (blurred/defocused — just soft squares)
    sticky_data = [(canvas*0.05, cH*0.15, (240,210,60)), (canvas*0.72, cH*0.20, (255,160,100)),
                   (canvas*0.60, cH*0.12, (180,220,140)), (canvas*0.08, cH*0.68, (255,200,200))]
    for sx, sy, sc in sticky_data:
        sz = int(canvas * 0.095)
        zd.rectangle([int(sx), int(sy), int(sx+sz), int(sy+sz)], fill=sc+(200,))

    # Hand / fingers at bottom — partial view, gripping folder
    hand_y = int(cH * 0.72)
    for i in range(4):
        hx  = int(canvas * 0.25 + i * canvas * 0.12)
        hw2 = int(canvas * 0.055)
        hh2 = int(cH * 0.18)
        zd.rounded_rectangle([hx, hand_y, hx+hw2, hand_y+hh2], radius=12,
                              fill=(195, 155, 115, 255))
    # Palm
    zd.rectangle([int(canvas*0.22), hand_y+int(cH*0.06), int(canvas*0.78), hand_y+hh2],
                 fill=(185, 145, 108, 255))

    # Defocus sticky notes with blur
    zoomed_blur = zoomed.filter(ImageFilter.GaussianBlur(3))
    zoomed_paste = Image.composite(zoomed, zoomed_blur, Image.new('L', zoomed.size, 100))

    # Crop-zoom back to W×H
    ox = (canvas - W) // 2
    oy = (cH - H) // 2
    cropped = zoomed_paste.crop((ox, oy, ox+W, oy+H))

    arr = np.array(cropped)
    # Fluorescent colour grade: slight cyan/green push, low contrast
    arr = color_grade(arr, r_mul=0.88, g_mul=0.96, b_mul=0.92, contrast=0.88, brightness=-0.01)
    arr = vignette(arr, strength=0.65)
    arr = add_grain(arr, strength=0.045)
    return Image.fromarray(arr[:,:,:3], 'RGB')


# ── Scene 2 — THE ENVIRONMENT (0:04–0:09) ────────────────────────────────────
def render_corridor(frame):
    t  = scene_t(frame, 'corridor')
    et = ease_in_out(t)

    img  = Image.new('RGBA', (W, H), (30, 32, 28, 255))
    draw = ImageDraw.Draw(img)

    # Vanishing point (camera pushes forward → vp moves outward / walls widen)
    vp_y  = int(H * lerp(0.42, 0.40, et))
    vp_x  = W // 2
    spread = lerp(0.30, 0.40, et)   # how wide the corridor is

    # Floor gradient
    for yy in range(vp_y, H, 3):
        prog  = (yy - vp_y) / (H - vp_y)
        shade = int(lerp(28, 55, prog))
        draw.rectangle([0, yy, W, yy+3], fill=(shade, shade-2, shade-4, 255))

    # Ceiling
    for yy in range(0, vp_y, 3):
        prog  = 1 - yy / vp_y
        shade = int(lerp(20, 10, prog))
        draw.rectangle([0, yy, W, yy+3], fill=(shade, shade, shade+2, 255))

    # Corridor walls (left/right) as trapezoidal perspective
    wl_top = int(vp_x - W * 0.05)
    wr_top = int(vp_x + W * 0.05)
    wl_bot = int(vp_x - W * spread)
    wr_bot = int(vp_x + W * spread)

    # Left wall
    draw.polygon([(0, 0), (wl_top, vp_y), (wl_bot, H), (0, H)], fill=(38, 36, 32, 255))
    # Right wall
    draw.polygon([(W, 0), (wr_top, vp_y), (wr_bot, H), (W, H)], fill=(32, 30, 28, 255))

    # Floor tiles (receding lines)
    for i in range(1, 12):
        ty  = int(vp_y + (H - vp_y) * (i / 12) ** 0.7)
        txl = int(wl_top + (wl_bot - wl_top) * (i / 12))
        txr = int(wr_top + (wr_bot - wr_top) * (i / 12))
        draw.line([(txl, ty), (txr, ty)], fill=(50, 48, 44, 255), width=1)

    # Vertical wall lines
    for i in range(1, 8):
        frac = i / 8
        lx   = int(wl_top + (wl_bot - wl_top) * frac)
        rx   = int(wr_top + (wr_bot - wr_top) * frac)
        # Left wall vertical
        draw.line([(int(wl_top*frac*0.3), 0), (lx, vp_y)], fill=(45, 43, 38, 255), width=1)

    # Afternoon window light — warm vertical shafts on right wall
    for shaft in range(3):
        wx   = int(wr_top + (wr_bot - wr_top) * (shaft * 0.28 + 0.1))
        wx_b = wx + int((wr_bot - wr_top) * 0.06)
        wy_t = vp_y + shaft * 20
        # Light shaft polygon
        draw.polygon([(wx, wy_t), (wx_b, wy_t), (wx_b + 40, H), (wx - 20, H)],
                     fill=(80, 62, 28, 60))

    # Laptop trolley — centre-right, receding into corridor
    tx = int(vp_x + W * 0.08)
    ty2 = int(vp_y + (H - vp_y) * 0.15)
    tw = int(W * lerp(0.22, 0.28, et))
    th = int(H * lerp(0.30, 0.38, et))
    # Trolley frame
    draw.rectangle([tx, ty2, tx+tw, ty2+th], outline=(70, 70, 65, 255), width=2)
    draw.rectangle([tx+4, ty2+4, tx+tw-4, ty2+th-4], fill=(22, 22, 20, 255))
    # Shelves with laptops
    shelf_count = 4
    for s in range(shelf_count):
        sy2  = ty2 + int(th * (s+0.5) / shelf_count)
        sh   = int(th * 0.18)
        # Shelf line
        draw.line([(tx, sy2+sh), (tx+tw, sy2+sh)], fill=(60, 60, 55, 255), width=2)
        # Laptop silhouettes
        for lap in range(3):
            lx2  = tx + 8 + lap * int((tw - 16) / 3)
            lw2  = int((tw - 16) / 3) - 6
            # Laptop body
            draw.rectangle([lx2, sy2+2, lx2+lw2, sy2+sh-4],
                           fill=(35, 35, 32, 255), outline=(55, 55, 50, 255))
            # No labels — unlabelled and untracked
            draw.rectangle([lx2+4, sy2+5, lx2+lw2-4, sy2+sh-8],
                           fill=(28, 28, 26, 255))

    # Colour grade: desaturated, institutional
    arr = np.array(img)
    arr = color_grade(arr, r_mul=0.92, g_mul=0.90, b_mul=0.85, contrast=0.92, brightness=-0.02)
    arr = vignette(arr, strength=0.70)
    arr = add_grain(arr, strength=0.038)
    return Image.fromarray(arr[:,:,:3], 'RGB')


# ── Scene 3 — THE MOMENT (0:09–0:14) ─────────────────────────────────────────
def render_moment(frame):
    t  = scene_t(frame, 'moment')
    lo, hi = S['moment']
    rel = frame - lo   # 0..119

    img  = Image.new('RGBA', (W, H), (12, 12, 12, 255))
    draw = ImageDraw.Draw(img)

    # Background — soft desk surface suggestion
    for yy in range(H//2, H, 4):
        v = int(lerp(14, 8, (yy - H//2) / (H//2)))
        draw.rectangle([0, yy, W, yy+4], fill=(v+2, v, v-1, 255))

    # Asset label on laptop — centred, mid-frame
    lw2, lh2 = 540, 280
    lx2 = (W - lw2) // 2
    ly2 = int(H * 0.36)

    # Laptop body suggestion (dark rectangle behind label)
    draw.rectangle([lx2-80, ly2-120, lx2+lw2+80, ly2+lh2+120],
                   fill=(22, 22, 20, 255), outline=(40, 40, 38, 255), width=2)
    # Screen area (dark)
    draw.rectangle([lx2-60, ly2-100, lx2+lw2+60, ly2+lh2+60],
                   fill=(18, 18, 16, 255))

    # Asset label (white sticker)
    draw.rectangle([lx2, ly2, lx2+lw2, ly2+lh2],
                   fill=(250, 248, 244, 255), outline=(200, 198, 192, 255), width=1)
    # Label border stripe
    draw.rectangle([lx2, ly2, lx2+lw2, ly2+14], fill=(210, 55, 55, 255))

    # Label text
    f_label = font(FONT_MONO_BOLD, 24)
    f_small = font(FONT_MONO, 20)
    draw.text((lx2+16, ly2+24), "ASSET TAG", font=f_label, fill=(30, 30, 30, 255))
    draw.text((lx2+16, ly2+62), "ID:    2847",          font=f_small, fill=(50, 50, 50, 255))
    draw.text((lx2+16, ly2+92), "MODEL: Dell Latitude 5420", font=f_small, fill=(50, 50, 50, 255))
    draw.text((lx2+16, ly2+122),"S/N:   7X4K2-P9MRQ",   font=f_small, fill=(50, 50, 50, 255))
    draw.text((lx2+16, ly2+152),"LOC:   IT Store / B12", font=f_small, fill=(50, 50, 50, 255))

    # Barcode stripes
    bx = lx2 + 16
    by = ly2 + 200
    bar_w = [2,4,2,6,2,3,4,2,3,5,2,4,2,3,6,2,4,2,3,5,2,4,2,6,2,3,4,2]
    cur = bx
    for i, bw in enumerate(bar_w):
        if i % 2 == 0:
            draw.rectangle([cur, by, cur+bw, by+44], fill=(20, 20, 20, 255))
        cur += bw

    # ── Viewfinder overlay (smartphone) ──
    # Smartphone frame
    sp_w, sp_h = 360, 640
    sp_x = (W - sp_w) // 2
    sp_y = int(H * 0.20)
    # Phone outline
    draw.rounded_rectangle([sp_x, sp_y, sp_x+sp_w, sp_y+sp_h],
                           radius=24, outline=(80, 80, 80, 255), width=3)
    # Phone screen area (transparent viewfinder — dark tint)
    vf_x = sp_x + 8
    vf_y = sp_y + 8
    vf_w = sp_w - 16
    vf_h = sp_h - 16
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od      = ImageDraw.Draw(overlay)
    od.rectangle([vf_x, vf_y, vf_x+vf_w, vf_y+vf_h], fill=(0, 0, 0, 120))
    img     = Image.alpha_composite(img, overlay)
    draw    = ImageDraw.Draw(img)

    # ── Lime-yellow corner bracket guides ──
    # They animate in during first 40 frames, then glow/pulse
    bracket_t = clamp(rel / 40, 0, 1)
    bracket_t = ease_out(bracket_t)
    arm = int(lerp(0, 55, bracket_t))   # bracket arm length
    bthick = 5
    corners = [
        (vf_x + 18,        vf_y + 18),        # top-left
        (vf_x + vf_w - 18, vf_y + 18),        # top-right
        (vf_x + 18,        vf_y + vf_h - 18), # bottom-left
        (vf_x + vf_w - 18, vf_y + vf_h - 18),# bottom-right
    ]
    dirs = [(1, 1), (-1, 1), (1, -1), (-1, -1)]

    # Subtle pulse glow on brackets
    pulse = 0.85 + 0.15 * math.sin(rel * 0.35)
    bc    = tuple(int(c * pulse) for c in ACCENT)

    for (cx2, cy2), (dx, dy) in zip(corners, dirs):
        if arm > 0:
            # Horizontal arm (sort coords so x0<=x1, y0<=y1)
            hx0, hx1 = sorted([cx2, cx2 + dx*arm])
            hy0, hy1 = sorted([cy2, cy2 + dy*bthick])
            draw.rectangle([hx0, hy0, hx1, hy1], fill=bc+(255,))
            # Vertical arm
            vx0, vx1 = sorted([cx2, cx2 + dx*bthick])
            vy0, vy1 = sorted([cy2, cy2 + dy*arm])
            draw.rectangle([vx0, vy0, vx1, vy1], fill=bc+(255,))

    # Centre crosshair dot
    if bracket_t > 0.5:
        dot_alpha = int(lerp(0, 255, (bracket_t-0.5)*2))
        draw.ellipse([W//2-4, sp_y+sp_h//2-4, W//2+4, sp_y+sp_h//2+4],
                     fill=(*ACCENT, dot_alpha))

    # Horizontal scanning line
    scan_t = clamp((rel - 20) / 80, 0, 1)
    if scan_t > 0 and rel < 115:
        scan_y = int(vf_y + vf_h * scan_t)
        line_overlay = Image.new('RGBA', (W, H), (0,0,0,0))
        ld = ImageDraw.Draw(line_overlay)
        ld.rectangle([vf_x, scan_y-1, vf_x+vf_w, scan_y+2],
                     fill=(*ACCENT, 180))
        img = Image.alpha_composite(img, line_overlay)
        draw = ImageDraw.Draw(img)

    # ── Camera flash — last 8 frames ──
    if rel >= 112:
        flash_t = (rel - 112) / 7
        flash_a = int(ease_out(flash_t) * 255)
        flash_overlay = Image.new('RGBA', (W, H), (255, 255, 255, flash_a))
        img = Image.alpha_composite(img, flash_overlay)
        draw = ImageDraw.Draw(img)

    arr = np.array(img)[:,:,:3]
    arr = color_grade(arr, r_mul=0.90, g_mul=0.90, b_mul=0.88, contrast=1.05)
    arr = vignette(arr, strength=0.72)
    arr = add_grain(arr, strength=0.052)
    return Image.fromarray(arr, 'RGB')


# ── Scene 4 — THE MAGIC CUT (0:14–0:18) ──────────────────────────────────────
def render_magic(frame):
    t  = scene_t(frame, 'magic')
    lo, hi = S['magic']
    rel = frame - lo   # 0..95

    img  = Image.new('RGBA', (W, H), (10, 10, 14, 255))
    draw = ImageDraw.Draw(img)

    # White flash fading out
    if rel < 18:
        fade_a = int(lerp(255, 0, ease_out(rel / 18)))
        flash  = Image.new('RGBA', (W, H), (255, 255, 255, fade_a))
        img    = Image.alpha_composite(img, flash)
        draw   = ImageDraw.Draw(img)

    # Clinical dark background with subtle grid
    grid_color = (22, 22, 30, 255)
    for xx in range(0, W, 60):
        draw.rectangle([xx, 0, xx+1, H], fill=grid_color)
    for yy in range(0, H, 60):
        draw.rectangle([0, yy, W, yy+1], fill=grid_color)

    # ── Spreadsheet ──
    sheet_x  = 60
    sheet_y  = int(H * 0.18)
    col_w    = [80, 220, 200, 160, 240]   # ID | Serial | Model | Mfr | Location
    col_keys = ["#", "Serial", "Model", "Manufacturer", "Location"]
    row_h    = 64
    rows     = 6

    # Calculate start x for each column
    col_x = [sheet_x]
    for cw in col_w[:-1]:
        col_x.append(col_x[-1] + cw)

    # Header row
    header_y = sheet_y
    draw.rectangle([sheet_x, header_y, sheet_x + sum(col_w), header_y + row_h],
                   fill=(24, 24, 34, 255))
    f_header = font(FONT_MONO_BOLD, 22)
    for i, (key, cx2) in enumerate(zip(col_keys, col_x)):
        draw.text((cx2 + 10, header_y + 18), key,
                  font=f_header, fill=(140, 140, 160, 255))
    # Header bottom border
    draw.rectangle([sheet_x, header_y+row_h-2, sheet_x+sum(col_w), header_y+row_h],
                   fill=(40, 40, 60, 255))

    # Existing rows (pre-populated, static)
    existing_data = [
        ("001", "F3KX9-2MRQ7", "HP EliteBook 840",   "HP",    "Room A / Shelf 2"),
        ("002", "9LMP4-ZXRT1", "Lenovo ThinkPad T14", "Lenovo","Room A / Shelf 3"),
        ("003", "2BVW8-NQY56", "HP EliteBook 840",   "HP",    "Room B / Trolley"),
        ("004", "K7TZA-3FDN0", "Apple MacBook Air",  "Apple", "Room C / Cabinet"),
    ]
    f_data = font(FONT_MONO, 20)
    for ri, row_data in enumerate(existing_data):
        ry = header_y + row_h * (ri + 1)
        # Alternating row bg
        row_fill = (16, 16, 22, 255) if ri % 2 == 0 else (13, 13, 18, 255)
        draw.rectangle([sheet_x, ry, sheet_x+sum(col_w), ry+row_h-1], fill=row_fill)
        for ci, (val, cx2) in enumerate(zip(row_data, col_x)):
            draw.text((cx2+10, ry+18), val, font=f_data, fill=(180, 178, 172, 255))
        draw.rectangle([sheet_x, ry+row_h-1, sheet_x+sum(col_w), ry+row_h],
                       fill=(28, 28, 40, 255))

    # ── NEW ROW populating (the magic) ──
    new_row_y = header_y + row_h * 5
    draw.rectangle([sheet_x, new_row_y, sheet_x+sum(col_w), new_row_y+row_h-1],
                   fill=(16, 24, 16, 255))
    # Lime-yellow highlight on new row
    hi_overlay = Image.new('RGBA', (W, H), (0,0,0,0))
    hd = ImageDraw.Draw(hi_overlay)
    hi_alpha = int(lerp(60, 25, t))
    hd.rectangle([sheet_x, new_row_y, sheet_x+sum(col_w), new_row_y+row_h-1],
                 fill=(*ACCENT, hi_alpha))
    img  = Image.alpha_composite(img, hi_overlay)
    draw = ImageDraw.Draw(img)

    new_data = ("005", "7X4K2-P9MRQ", "Dell Latitude 5420", "Dell", "IT Store / B12")

    # Each field reveals progressively
    # rel 18..95 is the "typewriter" period
    type_t    = clamp((rel - 18) / 75, 0, 1)
    field_dur = 1.0 / len(new_data)
    f_new     = font(FONT_MONO_BOLD, 20)

    for ci, (val, cx2) in enumerate(zip(new_data, col_x)):
        field_t = clamp((type_t - ci * field_dur) / field_dur, 0, 1)
        chars   = int(len(val) * ease_out(field_t))
        partial = val[:chars]
        if partial:
            draw.text((cx2+10, new_row_y+18), partial, font=f_new, fill=(*ACCENT, 255))
        # Blinking cursor
        if 0 < field_t < 1.0 and chars < len(val):
            blink = (frame % 6) < 3
            if blink:
                cx3 = cx2 + 10 + len(partial) * 12
                draw.rectangle([cx3, new_row_y+16, cx3+2, new_row_y+44],
                               fill=(*ACCENT, 255))

    # Column dividers
    for cx2 in col_x[1:]:
        draw.rectangle([cx2-1, sheet_y, cx2, sheet_y+row_h*(rows+1)],
                       fill=(32, 32, 48, 255))

    arr = np.array(img)[:,:,:3]
    arr = color_grade(arr, r_mul=0.88, g_mul=0.90, b_mul=1.02, contrast=1.05)
    arr = vignette(arr, strength=0.58)
    arr = add_grain(arr, strength=0.025)
    return Image.fromarray(arr, 'RGB')


# ── Scene 5 — THE PAYOFF (0:18–0:23) ─────────────────────────────────────────
ROOM_TINTS = [
    ((15, 18, 28), (0.85, 0.88, 1.05)),   # blue classroom
    ((18, 18, 16), (0.92, 0.92, 0.90)),   # neutral office
    ((22, 16, 10), (1.05, 0.90, 0.80)),   # warm storage
    ((12, 18, 22), (0.82, 0.90, 1.08)),   # cool lab
    ((20, 16, 12), (1.02, 0.88, 0.82)),   # warm library
]
ASSET_COUNTS = [12, 47, 183, 341]

def render_payoff(frame):
    lo, hi  = S['payoff']
    rel     = frame - lo   # 0..119
    dur     = hi - lo      # 120 frames

    # Accelerating cut schedule: cuts at frames 0, 30, 55, 76, 96
    cut_points = [0, 30, 55, 76, 96, 120]
    room_idx   = 0
    for i in range(len(cut_points)-1):
        if rel >= cut_points[i]:
            room_idx = i

    room_start = cut_points[room_idx]
    room_end   = cut_points[room_idx + 1]
    room_t     = (rel - room_start) / max(room_end - room_start, 1)
    room_bg, room_grade = ROOM_TINTS[min(room_idx, len(ROOM_TINTS)-1)]

    img  = Image.new('RGBA', (W, H), (*room_bg, 255))
    draw = ImageDraw.Draw(img)

    # Room floor / wall gradient
    for yy in range(0, H, 4):
        prog  = yy / H
        shade = int(lerp(room_bg[0]*1.2, room_bg[0]*0.6, prog))
        shade = clamp(shade, 0, 255)
        draw.rectangle([0, yy, W, yy+4],
                       fill=(clamp(shade+room_bg[0]//8,0,255),
                             clamp(shade+room_bg[1]//8,0,255),
                             clamp(shade+room_bg[2]//8,0,255), 255))

    # Room elements — door/window shapes
    if room_idx % 2 == 0:
        # Windows — warm light rectangles
        for wi in range(2):
            wx2 = 80 + wi * 480
            draw.rectangle([wx2, int(H*0.08), wx2+260, int(H*0.38)],
                           fill=(60, 50, 25, 255))
            draw.rectangle([wx2+6, int(H*0.09), wx2+254, int(H*0.37)],
                           fill=(80, 65, 30, 255))
    else:
        # Shelving / lockers
        for li in range(4):
            lx2 = 60 + li * 240
            draw.rectangle([lx2, int(H*0.05), lx2+180, int(H*0.80)],
                           fill=(room_bg[0]+12, room_bg[1]+10, room_bg[2]+8, 255),
                           outline=(room_bg[0]+25,)*3+(255,), width=2)

    # Person silhouette — mid-right, purposeful
    ps_x = int(W * 0.55)
    ps_y = int(H * 0.25)
    ps_w = int(W * 0.22)
    ps_h = int(H * 0.55)

    # Body
    draw.rectangle([ps_x, ps_y+int(ps_h*0.18), ps_x+ps_w, ps_y+ps_h],
                   fill=(20, 20, 18, 255))
    # Head
    draw.ellipse([ps_x+ps_w//4, ps_y, ps_x+ps_w*3//4, ps_y+int(ps_h*0.18)],
                 fill=(25, 22, 20, 255))
    # Arm holding phone (extended forward/up)
    arm_x = ps_x - int(ps_w * 0.55)
    arm_y = ps_y + int(ps_h * 0.22)
    draw.rectangle([arm_x, arm_y, ps_x + int(ps_w*0.1), arm_y + int(ps_h*0.08)],
                   fill=(22, 20, 18, 255))
    # Phone in hand
    ph_w, ph_h = 42, 74
    draw.rounded_rectangle([arm_x-ph_w, arm_y-ph_h//2, arm_x, arm_y+ph_h//2],
                           radius=6, fill=(35, 35, 35, 255), outline=(60,60,60,255), width=2)
    # Phone flash (lime-yellow dot = scanning)
    draw.ellipse([arm_x-ph_w//2-6, arm_y-8, arm_x-ph_w//2+6, arm_y+8],
                 fill=(*ACCENT, 255))

    # Flash frame at cut points
    flash_fade = 0
    for cp in cut_points[1:]:
        if cp == room_start and rel == cp - lo:
            flash_fade = 255
        elif rel < room_start + 5:
            flash_fade = int(lerp(220, 0, ease_out((rel - room_start) / 5)))
            break

    if flash_fade > 0:
        fl = Image.new('RGBA', (W, H), (255, 255, 255, flash_fade))
        img = Image.alpha_composite(img, fl)
        draw = ImageDraw.Draw(img)

    # ── Asset counter (bottom-right) ──
    count_idx = min(room_idx, len(ASSET_COUNTS)-1)
    count_val = ASSET_COUNTS[count_idx]
    # Tick up within room
    prev_count = ASSET_COUNTS[max(count_idx-1, 0)]
    count_t    = ease_out(room_t)
    displayed  = int(lerp(prev_count if count_idx > 0 else 0, count_val, count_t))

    count_str = str(displayed)
    f_count   = font(FONT_MONO_BOLD, 100)
    f_label   = font(FONT_MONO, 28)

    # Counter background pill
    cb_x, cb_y = W - 360, H - 220
    draw.rounded_rectangle([cb_x-16, cb_y-16, W-40, H-80],
                           radius=16, fill=(0, 0, 0, 180))
    draw.text((cb_x, cb_y), count_str, font=f_count, fill=(*ACCENT, 255))
    draw.text((cb_x, cb_y + 105), "assets scanned", font=f_label, fill=(*FG, 180))

    arr = np.array(img)[:,:,:3]
    arr = color_grade(arr, r_mul=room_grade[0], g_mul=room_grade[1], b_mul=room_grade[2],
                      contrast=0.90, brightness=-0.02)
    arr = vignette(arr, strength=0.62)
    arr = add_grain(arr, strength=0.042)
    return Image.fromarray(arr, 'RGB')


# ── Scene 6 — THE RELIEF (0:23–0:27) ─────────────────────────────────────────
def render_relief(frame):
    t  = scene_t(frame, 'relief')
    et = ease_in_out(t)

    img  = Image.new('RGBA', (W, H), (14, 11, 9, 255))
    draw = ImageDraw.Draw(img)

    # Warm desk surface
    for yy in range(int(H*0.48), H, 4):
        prog  = (yy - H*0.48) / (H*0.52)
        shade = int(lerp(38, 22, prog))
        r = int(lerp(52, 30, prog))
        g = int(lerp(40, 22, prog))
        b = int(lerp(28, 14, prog))
        draw.rectangle([0, yy, W, yy+4], fill=(r, g, b, 255))

    # Wall behind — dark warm
    for yy in range(0, int(H*0.48), 4):
        prog = yy / (H*0.48)
        v    = int(lerp(18, 28, prog))
        draw.rectangle([0, yy, W, yy+4], fill=(v+4, v+1, v-2, 255))

    # Desk edge line
    ey = int(H * 0.48)
    draw.rectangle([0, ey, W, ey+3], fill=(60, 45, 28, 255))

    # Amber rim light from left side
    for xx in range(0, int(W*0.18), 4):
        alpha = int(lerp(90, 0, xx/(W*0.18)))
        light_overlay = Image.new('RGBA', (W, H), (0,0,0,0))
        ld = ImageDraw.Draw(light_overlay)
        ld.rectangle([xx, 0, xx+4, H], fill=(140, 95, 30, alpha))
        img = Image.alpha_composite(img, light_overlay)
    draw = ImageDraw.Draw(img)

    # Closed laptop (centre)
    lp_x = int(W * 0.20)
    lp_y = int(H * 0.38)
    lp_w = int(W * 0.60)
    lp_h = int(H * 0.09)
    # Laptop base
    draw.rounded_rectangle([lp_x, lp_y, lp_x+lp_w, lp_y+lp_h],
                           radius=8, fill=(32, 32, 30, 255), outline=(50,50,48,255), width=2)
    # Apple/brand mark area
    draw.ellipse([lp_x+lp_w//2-18, lp_y+lp_h//2-14, lp_x+lp_w//2+18, lp_y+lp_h//2+14],
                 fill=(40, 40, 38, 255))
    # Lid (thin, closed)
    draw.rounded_rectangle([lp_x+8, lp_y-8, lp_x+lp_w-8, lp_y+8],
                           radius=4, fill=(28, 28, 26, 255))

    # ── CSV printout on table ──
    paper_x = int(W * 0.10)
    paper_y = int(H * 0.53)
    paper_w = int(W * 0.80)
    paper_h = int(H * 0.30)
    # Paper shadow
    draw.rectangle([paper_x+8, paper_y+8, paper_x+paper_w+8, paper_y+paper_h+8],
                   fill=(8, 6, 4, 255))
    # Paper body
    draw.rectangle([paper_x, paper_y, paper_x+paper_w, paper_y+paper_h],
                   fill=(244, 242, 238, 255))
    # Paper header
    draw.rectangle([paper_x, paper_y, paper_x+paper_w, paper_y+36],
                   fill=(232, 245, 66, 255))
    f_ph = font(FONT_MONO_BOLD, 20)
    draw.text((paper_x+16, paper_y+8), "SNAPXACT  —  Asset Export  —  341 records",
              font=f_ph, fill=(20, 20, 20, 255))

    # Dense CSV rows (just line patterns)
    f_csv = font(FONT_MONO, 14)
    csv_rows = [
        "001, F3KX9-2MRQ7, HP EliteBook 840, HP,    Room A / Shelf 2,  Assigned",
        "002, 9LMP4-ZXRT1, Lenovo ThinkPad, Lenovo, Room A / Shelf 3,  Assigned",
        "003, 2BVW8-NQY56, HP EliteBook 840, HP,    Room B / Trolley,  Unassigned",
        "004, K7TZA-3FDN0, Apple MacBook Air,Apple, Room C / Cabinet,  Assigned",
        "005, 7X4K2-P9MRQ, Dell Latitude,    Dell,  IT Store / B12,    Assigned",
        "006, RMN29-4KXZQ, Lenovo ThinkPad, Lenovo, Room D / Desk 4,  Assigned",
        "007, XP1K8-TMVZ5, HP EliteBook 640, HP,    Room A / Shelf 1,  Assigned",
        "008, BL6W3-FHNT2, Dell Latitude,    Dell,  Server Room,       Unassigned",
        "...",
        "341, 5YQR7-DJCN1, HP EliteBook 840, HP,    Room H / Shelf 5,  Assigned",
    ]
    for ri, row_text in enumerate(csv_rows):
        ry2 = paper_y + 44 + ri * 18
        if ry2 + 16 < paper_y + paper_h:
            fill_c = (40, 40, 38, 255) if ri % 2 == 0 else (70, 68, 64, 255)
            draw.text((paper_x+10, ry2), row_text, font=f_csv, fill=fill_c)

    # Hands resting on table
    for side, hx in [(1, int(W*0.18)), (-1, int(W*0.72))]:
        hw2, hh2 = int(W*0.15), int(H*0.06)
        hy2 = int(H*0.86)
        draw.rounded_rectangle([hx, hy2, hx+hw2, hy2+hh2],
                               radius=20, fill=(175, 138, 105, 255))
        # Fingers
        for fi in range(4):
            fx2 = hx + fi * (hw2//4) + 4
            draw.rounded_rectangle([fx2, hy2-int(hh2*0.7), fx2+hw2//5, hy2+8],
                                   radius=10, fill=(168, 132, 100, 255))

    # Slow camera settle — subtle downward drift
    settle = int(lerp(0, 6, ease_out(t)))
    img = img.crop((0, settle, W, H+settle)) if settle < H else img
    img = img.resize((W, H), Image.LANCZOS) if img.size != (W, H) else img

    arr = np.array(img)[:,:,:3] if img.mode == 'RGB' else np.array(img.convert('RGB'))
    arr = color_grade(arr, r_mul=1.04, g_mul=0.94, b_mul=0.82, contrast=0.88, brightness=0.01)
    arr = vignette(arr, strength=0.55)
    arr = add_grain(arr, strength=0.030)
    return Image.fromarray(arr, 'RGB')


# ── Scene 7 — END CARD (0:27–0:30) ───────────────────────────────────────────
def render_endcard(frame):
    lo, hi = S['endcard']
    rel    = frame - lo    # 0..71
    dur    = hi - lo       # 72

    # Fade in: 0-24, hold: 24-48, fade out: 48-72
    if rel < 24:
        alpha = int(ease_out(rel / 24) * 255)
    elif rel < 48:
        alpha = 255
    else:
        alpha = int(lerp(255, 0, ease_in((rel - 48) / 24))  )

    img  = Image.new('RGB', (W, H), (0, 0, 0))
    draw = ImageDraw.Draw(img)

    if alpha > 0:
        text_layer = Image.new('RGBA', (W, H), (0,0,0,0))
        td         = ImageDraw.Draw(text_layer)

        f_brand   = font(FONT_BOLD, 128)
        f_tag     = font(FONT_REG,  46)
        f_url     = font(FONT_BOLD, 38)

        # SNAPXACT — large, lime-yellow
        brand_text = "SNAPXACT"
        bb = td.textbbox((0,0), brand_text, font=f_brand)
        bw = bb[2]-bb[0]
        brand_x = (W - bw) // 2
        brand_y = int(H * 0.36)
        td.text((brand_x, brand_y), brand_text, font=f_brand, fill=(*ACCENT, alpha))

        # Thin separator line
        sep_y = brand_y + (bb[3]-bb[1]) + 28
        sep_len = int(W * 0.35)
        sep_x   = (W - sep_len) // 2
        td.rectangle([sep_x, sep_y, sep_x+sep_len, sep_y+2],
                     fill=(*FG, alpha//3))

        # Tagline — warm off-white
        tag_text = "A photo becomes data."
        tb = td.textbbox((0,0), tag_text, font=f_tag)
        tw = tb[2]-tb[0]
        td.text(((W-tw)//2, sep_y + 30), tag_text, font=f_tag,
                fill=(*FG, int(alpha * 0.88)))

        # URL — lime-yellow, smaller
        url_text = "snapxact.com"
        ub = td.textbbox((0,0), url_text, font=f_url)
        uw = ub[2]-ub[0]
        td.text(((W-uw)//2, sep_y + 110), url_text, font=f_url,
                fill=(*ACCENT, int(alpha * 0.85)))

        img_rgba = Image.new('RGBA', (W, H), (0,0,0,255))
        img_rgba = Image.alpha_composite(img_rgba, text_layer)
        img      = img_rgba.convert('RGB')
        draw     = ImageDraw.Draw(img)

    arr = np.array(img)
    arr = add_grain(arr, strength=0.018)
    return Image.fromarray(arr, 'RGB')


# ── Audio generation ──────────────────────────────────────────────────────────
def generate_audio(path, sr=44100):
    total_samples = sr * 30
    audio = np.zeros(total_samples, dtype=np.float32)
    t_arr = np.arange(total_samples) / sr

    def sine(freq, t): return np.sin(2 * np.pi * freq * t)
    def env(t, lo, hi): return np.clip((t - lo) / max(hi-lo, 0.001), 0, 1)

    # ── Act 1 (0–9s): low uneasy drone ──
    drone_t = t_arr[:sr*9]
    drone   = (sine(52, drone_t) * 0.18 +
               sine(78, drone_t) * 0.08 +
               sine(104, drone_t) * 0.04)
    # Swell in
    swell   = np.clip(drone_t / 4.0, 0, 1) ** 2
    drone  *= swell
    # Subtle harmonic wobble
    wobble  = 1.0 + 0.06 * np.sin(2 * np.pi * 0.3 * drone_t)
    drone  *= wobble
    audio[:sr*9] += drone

    # Ambient white noise (very quiet — suggestion of school room)
    noise_a1 = np.random.randn(sr*9) * 0.012 * np.clip(drone_t / 3.0, 0, 1)
    audio[:sr*9] += noise_a1

    # ── Act 2 (9–14s): tension build, silence before flash ──
    tension_t  = np.arange(sr*5) / sr
    # Rising drone
    rise_freq  = np.linspace(52, 120, sr*5)
    tension    = np.sin(2*np.pi * np.cumsum(rise_freq) / sr) * 0.22
    # Fade out to silence in last 2s
    fade_out   = np.clip((5 - tension_t) / 2.0, 0, 1)
    tension   *= fade_out
    audio[sr*9:sr*14] += tension

    # ── Camera shutter click at 13.8s ──
    click_start = int(13.75 * sr)
    click_len   = int(0.04 * sr)
    click_t     = np.arange(click_len) / sr
    click       = (np.sin(2*np.pi*3000*click_t) *
                   np.exp(-click_t * 80) * 0.6)
    audio[click_start:click_start+click_len] += click

    # ── Act 3 (14–30s): minimal electronic score ──
    score_start = sr * 14
    score_t     = np.arange(sr*16) / sr

    # Bass pulse — 4/4 at ~116 BPM
    bpm      = 116
    beat_len = sr * 60 // bpm
    bass_arr = np.zeros(sr*16, dtype=np.float32)
    for beat in range(int(16 * bpm / 60) + 1):
        s = beat * beat_len
        if s < sr*16:
            beat_env = np.exp(-np.arange(min(beat_len*2, sr*16-s)) / (sr*0.12))
            seg_t    = np.arange(len(beat_env)) / sr
            freq     = 82 if beat % 4 == 0 else (98 if beat % 2 == 0 else 74)
            seg      = np.sin(2*np.pi*freq*seg_t) * beat_env * 0.28
            end_s    = min(s + len(seg), sr*16)
            bass_arr[s:end_s] += seg[:end_s-s]
    audio[score_start:score_start+sr*16] += bass_arr

    # Pad/atmosphere — high shimmery sine chords
    for freq, amp in [(880, 0.04), (1108, 0.03), (1320, 0.025), (659, 0.035)]:
        pad = np.sin(2*np.pi*freq*score_t) * amp
        # Tremolo
        trem = 1.0 + 0.15 * np.sin(2*np.pi*5.5*score_t)
        pad *= trem
        # Fade in slowly
        pad *= np.clip(score_t / 2.0, 0, 1)
        audio[score_start:score_start+sr*16] += pad

    # ── Typewriter ticks (14.2–18s) ──
    for tick_s in np.arange(14.2, 18.0, 0.18):
        ts = int(tick_s * sr)
        tl = int(0.015 * sr)
        tt = np.arange(tl) / sr
        tick = np.sin(2*np.pi*2800*tt) * np.exp(-tt*200) * 0.22
        if ts + tl < total_samples:
            audio[ts:ts+tl] += tick

    # ── Extra shutter clicks in payoff scene ──
    for click_t_s in [18.8, 19.7, 20.55, 21.35, 22.0]:
        cs = int(click_t_s * sr)
        cl = int(0.04 * sr)
        ct = np.arange(cl) / sr
        ck = np.sin(2*np.pi*2400*ct) * np.exp(-ct*70) * 0.45
        if cs + cl < total_samples:
            audio[cs:cs+cl] += ck

    # Final master + limiter
    audio  = np.clip(audio * 0.85, -1.0, 1.0)
    # Soft knee limiter
    audio  = np.tanh(audio * 1.2) / 1.2

    # Write WAV
    with wave.open(path, 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        pcm = (audio * 32767).astype(np.int16)
        wf.writeframes(pcm.tobytes())

    print(f"  Audio written → {path}")


# ── Main render loop ──────────────────────────────────────────────────────────
def get_scene(frame):
    for name, (lo, hi) in S.items():
        if lo <= frame < hi:
            return name
    return 'endcard'

RENDERERS = {
    'problem':  render_problem,
    'corridor': render_corridor,
    'moment':   render_moment,
    'magic':    render_magic,
    'payoff':   render_payoff,
    'relief':   render_relief,
    'endcard':  render_endcard,
}

def main():
    out_dir = os.path.dirname(os.path.abspath(__file__))
    raw_video = os.path.join(out_dir, "snapxact_raw.mp4")
    audio_wav = os.path.join(out_dir, "snapxact_audio.wav")
    final_mp4 = os.path.join(out_dir, "snapxact_promo.mp4")

    print("═" * 60)
    print("  SNAPXACT Cinematic Promo — Renderer")
    print(f"  {W}×{H} | {FPS}fps | {TOTAL} frames | 30s")
    print("═" * 60)

    # Step 1 — Audio
    print("\n[1/3] Generating audio…")
    generate_audio(audio_wav)

    # Step 2 — Video frames → ffmpeg pipe
    print("\n[2/3] Rendering frames…")
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "pipe:0",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        raw_video
    ]
    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE,
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    np.random.seed(0)  # reproducible grain
    for frame in range(TOTAL):
        scene   = get_scene(frame)
        img     = RENDERERS[scene](frame)
        # Halation pass on RGB
        img     = halation(img, radius=10, strength=0.18)
        proc.stdin.write(img.tobytes())

        if frame % 24 == 0:
            sec = frame // FPS
            print(f"  frame {frame:4d}/{TOTAL}  [{sec:02d}s]  scene={scene}", flush=True)

    proc.stdin.close()
    proc.wait()
    print(f"  Raw video → {raw_video}")

    # Step 3 — Mux audio + video
    print("\n[3/3] Muxing audio…")
    mux_cmd = [
        "ffmpeg", "-y",
        "-i", raw_video,
        "-i", audio_wav,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        final_mp4
    ]
    subprocess.run(mux_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.remove(raw_video)

    size_mb = os.path.getsize(final_mp4) / 1_048_576
    print(f"\n✓ Done → {final_mp4}  ({size_mb:.1f} MB)")
    print("═" * 60)


if __name__ == "__main__":
    main()
