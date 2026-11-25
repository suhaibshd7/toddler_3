from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageFilter
import cairosvg
import io, json

ROOT = Path(__file__).resolve().parent
ASSET = ROOT / 'assets' / 'cat' / 'mouth'
ASSET.mkdir(parents=True, exist_ok=True)
base_path = ROOT / 'assets' / 'cat' / 'wave' / 'frame-01.webp'
base_rgba = Image.open(base_path).convert('RGBA')
base_rgb = np.array(base_rgba.convert('RGB'))
h, w = base_rgb.shape[:2]

# Remove only the existing open-mouth pigments/outline from the approved frame.
# The surrounding muzzle, nose, whiskers, and face remain untouched.
y1, y2, x1, x2 = 170, 211, 154, 216
roi = base_rgb[y1:y2, x1:x2]
dark = roi.min(axis=2) < 72
red = (roi[:, :, 0] > 140) & (roi[:, :, 0] > roi[:, :, 1] * 1.32) & (roi[:, :, 0] > roi[:, :, 2] * 1.18)
mask_roi = (dark | red).astype(np.uint8)
num, labels, stats, centers = cv2.connectedComponentsWithStats(mask_roi, 8)
keep = np.zeros_like(mask_roi)
for i in range(1, num):
    x, y, cw, ch, area = stats[i]
    cx, cy = centers[i]
    # Only the connected mouth components in the lower central muzzle.
    if area >= 5 and 10 <= cx <= 53 and 4 <= cy <= 39:
        keep[labels == i] = 1
keep = cv2.dilate(keep, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)), iterations=1)
full_mask = np.zeros((h, w), dtype=np.uint8)
full_mask[y1:y2, x1:x2] = keep * 255
clean_bgr = cv2.inpaint(cv2.cvtColor(base_rgb, cv2.COLOR_RGB2BGR), full_mask, 4, cv2.INPAINT_TELEA)
clean_rgb = cv2.cvtColor(clean_bgr, cv2.COLOR_BGR2RGB)
clean_base = Image.fromarray(clean_rgb, 'RGB').convert('RGBA')

# Blend a feather-edged copy of the restored muzzle region over the still-open
# source mouth. The patch extends into identical neighboring fur, so its edge
# is invisible while the app keeps its existing wave PNG as the lower layer.
patch_alpha = Image.new('L', (w, h), 0)
from PIL import ImageDraw
draw = ImageDraw.Draw(patch_alpha)
draw.ellipse((148, 168, 219, 216), fill=255)
patch_alpha = patch_alpha.filter(ImageFilter.GaussianBlur(1.6))
# Keep the restoration entirely contained within the cream muzzle region.
patch_alpha_np = np.array(patch_alpha)
# Avoid unnecessary opacity on unchanged exterior pixels; only the feathered
# muzzle ellipse is added to each overlay.

# Shared SVG gradient definitions for detailed, softly shaded cartoon mouths.
SVG_DEFS = '''
<defs>
  <linearGradient id="cavity" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4d1715"/>
    <stop offset="0.52" stop-color="#651b1b"/>
    <stop offset="1" stop-color="#8b2425"/>
  </linearGradient>
  <linearGradient id="tongue" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ff9a8e"/>
    <stop offset="0.55" stop-color="#f66f68"/>
    <stop offset="1" stop-color="#d94b4d"/>
  </linearGradient>
  <linearGradient id="tongueSmall" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffb0a1"/>
    <stop offset="1" stop-color="#ee6563"/>
  </linearGradient>
  <filter id="mouthShadow" x="-30%" y="-35%" width="160%" height="180%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="0.85" result="blur"/>
    <feOffset dy="0.8" result="offset"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>'''

mouths = [
    {
      'id':'01-closed', 'label':'Closed mouth', 'duration':150,
      'svg': '''
        <path d="M183 173.4 C182.8 177.5 180.5 179.4 177.6 181.7 C173.7 184.8 168.7 185.9 164.3 182.5"
              fill="none" stroke="#552c22" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M183 178.6 C185.5 180.0 188.2 182.7 192.1 184.0 C196.3 185.4 200.5 184.2 203.8 180.8"
              fill="none" stroke="#552c22" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M168 185.2 C172.5 188.0 178.1 186.9 182.9 183.1 C187.3 186.7 193.4 188.0 198.4 184.9"
              fill="none" stroke="#a85c4d" stroke-width="0.75" stroke-linecap="round" opacity="0.45"/>
      '''
    },
    {
      'id':'02-slight', 'label':'Slightly open', 'duration':110,
      'svg': '''
        <g filter="url(#mouthShadow)">
          <path d="M169.6 181.1 C175.8 177.4 190.0 177.1 197.0 181.1 C194.5 188.6 174.3 189.2 169.6 181.1 Z"
                fill="url(#cavity)" stroke="#48201b" stroke-width="1.35" stroke-linejoin="round"/>
          <path d="M176.8 185.6 C181.8 187.5 188.0 187.2 191.5 185.2 C189.6 189.6 179.4 190.1 176.8 185.6 Z"
                fill="url(#tongueSmall)" stroke="#bd4b4b" stroke-width="0.55"/>
        </g>
      '''
    },
    {
      'id':'03-medium', 'label':'Medium open', 'duration':130,
      'svg': '''
        <g filter="url(#mouthShadow)">
          <path d="M165.8 180.9 C171.9 177.4 194.1 177.2 200.7 181.1 C200.5 190.7 192.2 198.5 183.2 198.8 C174.0 199.0 165.9 191.7 165.8 180.9 Z"
                fill="url(#cavity)" stroke="#48201b" stroke-width="1.55" stroke-linejoin="round"/>
          <path d="M171.8 190.7 C177.3 192.4 189.2 192.3 195.2 189.8 C194.1 197.1 188.9 200.0 183.1 200.0 C177.3 200.0 172.8 196.8 171.8 190.7 Z"
                fill="url(#tongue)" stroke="#b94346" stroke-width="0.75"/>
          <path d="M176.1 192.0 C180.1 190.9 187.2 191.1 191.7 192.1" fill="none" stroke="#ffc0ae" stroke-width="0.85" opacity="0.75" stroke-linecap="round"/>
        </g>
      '''
    },
    {
      'id':'04-wide', 'label':'Wide open', 'duration':120,
      'svg': '''
        <g filter="url(#mouthShadow)">
          <path d="M160.6 180.8 C169.2 175.8 196.9 175.9 205.4 181.2 C205.1 196.2 195.6 207.1 183.0 207.7 C170.5 207.8 160.5 196.6 160.6 180.8 Z"
                fill="url(#cavity)" stroke="#421c18" stroke-width="1.7" stroke-linejoin="round"/>
          <path d="M166.2 194.7 C174.3 197.2 192.3 197.2 199.8 193.7 C198.5 204.6 191.2 210.3 183.0 210.4 C174.8 210.2 167.8 204.0 166.2 194.7 Z"
                fill="url(#tongue)" stroke="#b74146" stroke-width="0.9"/>
          <path d="M173.0 197.0 C178.1 195.8 188.3 195.8 193.7 197.0" fill="none" stroke="#ffc4b2" stroke-width="1" opacity="0.8" stroke-linecap="round"/>
        </g>
      '''
    },
    {
      'id':'05-rounded-o', 'label':'Rounded O', 'duration':120,
      'svg': '''
        <g filter="url(#mouthShadow)">
          <path d="M183.0 178.1 C192.1 178.1 196.3 184.1 194.8 192.2 C193.6 200.7 189.0 205.1 183.0 205.1 C176.6 205.1 172.4 200.3 171.2 192.2 C169.9 184.0 174.3 178.1 183.0 178.1 Z"
                fill="url(#cavity)" stroke="#421c18" stroke-width="1.65" stroke-linejoin="round"/>
          <path d="M176.5 194.1 C180.1 196.2 186.2 196.2 189.6 193.9 C189.0 201.3 186.1 203.7 183.0 203.7 C179.8 203.7 177.0 201.0 176.5 194.1 Z"
                fill="url(#tongueSmall)" stroke="#b94346" stroke-width="0.65"/>
          <path d="M179.1 183.0 C181.4 181.5 185.1 181.5 187.1 183.2" fill="none" stroke="#a33a31" stroke-width="0.75" opacity="0.65" stroke-linecap="round"/>
        </g>
      '''
    },
    {
      'id':'06-happy', 'label':'Happy open', 'duration':135,
      'svg': '''
        <g filter="url(#mouthShadow)">
          <path d="M161.9 181.0 C170.1 176.0 195.7 176.1 204.1 181.3 C203.8 196.0 194.6 205.8 183.0 206.5 C171.6 206.4 162.1 196.0 161.9 181.0 Z"
                fill="url(#cavity)" stroke="#421c18" stroke-width="1.65" stroke-linejoin="round"/>
          <path d="M167.9 194.2 C175.0 196.4 191.2 196.2 198.2 193.8 C196.8 203.6 190.2 208.7 183.0 208.8 C175.9 208.6 169.4 203.5 167.9 194.2 Z"
                fill="url(#tongue)" stroke="#b74146" stroke-width="0.85"/>
          <path d="M174.0 196.4 C178.2 195.2 188.0 195.1 192.0 196.4" fill="none" stroke="#ffc2b2" stroke-width="0.95" opacity="0.8" stroke-linecap="round"/>
        </g>
      '''
    },
]

# Store a clean neutral full reference and generate six full-size transparent
# overlays. Every file retains exactly 418x418 canvas alignment.
clean_base.save(ASSET / 'muzzle-restored-base.png', optimize=True)
frames = []
for item in mouths:
    # Restored muzzle backing, feathered to transparency outside its small patch.
    patch = clean_base.copy()
    patch.putalpha(patch_alpha)
    patch_layer = patch

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
    {SVG_DEFS}
    {item['svg']}
    </svg>'''
    mouth_png = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode('utf-8'), output_width=w*3, output_height=h*3))).convert('RGBA')
    mouth_png = mouth_png.resize((w, h), Image.Resampling.LANCZOS)
    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    overlay.alpha_composite(patch_layer)
    overlay.alpha_composite(mouth_png)
    filename = f"frame-{int(item['id'][:2]):02d}-{item['id'][3:]}.webp"
    overlay.save(ASSET / filename, format='WEBP', lossless=True, method=6)

    # Full character composite from exact supplied frame-01, only replacing mouth.
    full = base_rgba.copy()
    full.alpha_composite(overlay)
    full.save(ASSET / f"full-{int(item['id'][:2]):02d}-{item['id'][3:]}.webp", format='WEBP', quality=90, method=6)
    frames.append((item, overlay, full, filename))

# 3x2 full-character sprite sheet, each tile is 418x418.
sheet = Image.new('RGBA', (w * 3, h * 2), (0, 0, 0, 0))
for i, (item, overlay, full, filename) in enumerate(frames):
    x = (i % 3) * w
    y = (i // 3) * h
    sheet.alpha_composite(full, (x, y))
sheet.save(ASSET / 'sprite-sheet-3x2.webp', format='WEBP', quality=90, method=6)

# Also ship six overlay tiles so other projects can layer the mouth over their
# own paw-wave frame without duplicating the whole cat.
overlay_sheet = Image.new('RGBA', (w * 3, h * 2), (0, 0, 0, 0))
for i, (item, overlay, full, filename) in enumerate(frames):
    overlay_sheet.alpha_composite(overlay, ((i % 3) * w, (i // 3) * h))
overlay_sheet.save(ASSET / 'overlay-sprite-sheet-3x2.webp', format='WEBP', lossless=True, method=6)

# Preview PNG with a discreet dark neutral matte behind the six character tiles.
preview = Image.new('RGBA', (w * 3, h * 2), (27, 30, 39, 255))
for i, (item, overlay, full, filename) in enumerate(frames):
    preview.alpha_composite(full, ((i % 3) * w, (i // 3) * h))
preview.convert('RGB').save(ASSET / 'preview-six-expressions.jpg', quality=92, optimize=True)

# Animation preview: a simple 6-state looping GIF using identical, fixed frames.
gif_frames = []
for item, overlay, full, filename in frames:
    bg = Image.new('RGBA', full.size, (27, 30, 39, 255))
    bg.alpha_composite(full)
    gif_frames.append(bg.convert('P', palette=Image.Palette.ADAPTIVE, colors=128))
gif_frames[0].save(ASSET / 'animation-preview.gif', save_all=True, append_images=gif_frames[1:], duration=[180, 130, 150, 130, 140, 170], loop=0, optimize=True, disposal=2)

manifest = {
  'name': 'Kitten Talking Mouth',
  'type': 'six-frame raster mouth overlays, with full character composites for preview/use',
  'canvas_size': [w, h],
  'frame_count': 6,
  'frames': [
    {'index': i+1, 'file': frames[i][3], 'full_character_file': f"full-{i+1:02d}-{frames[i][0]['id'][3:]}.webp", 'label': frames[i][0]['label'], 'duration_ms': frames[i][0]['duration'], 'overlay_alpha': True}
    for i in range(6)
  ],
  'sprite_sheet': {'file': 'sprite-sheet-3x2.webp', 'columns': 3, 'rows': 2, 'cell_size': [w,h]},
  'overlay_sprite_sheet': {'file': 'overlay-sprite-sheet-3x2.webp', 'columns': 3, 'rows': 2, 'cell_size': [w,h]},
  'app_integration': 'The game layers one full-canvas transparent mouth overlay above the existing nine-frame paw-wave image. Mouth animation starts from the actual MP3 playing event and closes when playback ends or is cancelled.',
  'note': 'The supplied wave frame-01 was used as the locked artwork base. Only the mouth pixels were restored/redrawn for these states.'
}
(ASSET / 'animation.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Generated {len(frames)} overlays at {w}x{h} and sprite sheets.')
