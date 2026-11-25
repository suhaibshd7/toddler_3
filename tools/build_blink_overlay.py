#!/usr/bin/env python3
"""Build assets/cat/blink/eyes-closed.webp from the idle pose (wave/frame-01.webp).

Authoring utility only; the game never runs it. It finds both eyes (outline +
sclera hull), inpaints them away from the surrounding fur, and draws a closed
eyelid curve fitted to each eye's lower edge. The result is a 418x418
transparent overlay aligned with wave/frame-01.webp ONLY: the other wave frames
are separately drawn, so the game hides the blink while a wave is playing.

Requires: Pillow, numpy, scipy, opencv-python. Run from anywhere.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np, cv2
from scipy import ndimage
from scipy.spatial import ConvexHull, Delaunay
ROOT=Path(__file__).resolve().parent.parent
SRC=ROOT/'assets'/'cat'/'wave'/'frame-01.webp'
OUT=ROOT/'assets'/'cat'/'blink'
im=Image.open(SRC).convert('RGBA'); a=np.array(im).astype(int)
rgb=a[...,:3]; v=rgb.max(axis=2); mn=rgb.min(axis=2); H,W=v.shape
boxes={'L':(118,94,167,149),'R':(206,108,262,164)}
masks={}
for name,(x0,y0,x1,y1) in boxes.items():
    cand=((v<110)|((mn>205)&((rgb.max(axis=2)-mn)<45)))
    sub=np.zeros((H,W),bool); sub[y0:y1,x0:x1]=cand[y0:y1,x0:x1]
    sub=ndimage.binary_closing(sub,iterations=2)
    lab,n=ndimage.label(sub); sizes=ndimage.sum(sub,lab,range(1,n+1)); comp=lab==(np.argmax(sizes)+1)
    pts=np.argwhere(comp)[:, ::-1]; hull=ConvexHull(pts); tri=Delaunay(pts[hull.vertices])
    yy,xx=np.mgrid[0:H,0:W]; m=(tri.find_simplex(np.stack([xx.ravel(),yy.ravel()],1))>=0).reshape(H,W)
    masks[name]=m
    ys,xs=np.where(m); print(name,'hull px',int(m.sum()),'bbox',xs.min(),ys.min(),xs.max(),ys.max())
union=np.logical_or(masks['L'],masks['R'])
grow=ndimage.binary_dilation(union,iterations=3)
# Inpaint the eyes away using surrounding fur colour (on opaque RGB; alpha stays 255 inside the cat)
bgr=cv2.cvtColor(np.array(im.convert('RGB')),cv2.COLOR_RGB2BGR)
inp=cv2.inpaint(bgr,(grow*255).astype(np.uint8),6,cv2.INPAINT_TELEA)
inp=cv2.cvtColor(inp,cv2.COLOR_BGR2RGB)
big=4  # supersample for the lid line
lid=Image.new('RGBA',(W*big,H*big),(0,0,0,0)); d=ImageDraw.Draw(lid)
for name,m in masks.items():
    ys,xs=np.where(m); x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max(); hgt=y1-y0
    # bottom boundary per column
    cols=np.arange(x0+2,x1-1); bot=np.array([np.where(m[:,c])[0].max() for c in cols])
    co=np.polyfit(cols,bot,2)
    # closed-lid curve: lower-lid parabola, lifted ~28% of eye height, slightly flatter
    xs_=np.linspace(x0+3,x1-3,40); ys_=np.polyval(co,xs_)
    mid=np.polyval(co,(x0+x1)/2); ys_=mid+(ys_-mid)*0.75-0.28*hgt
    pts=[(x*big,y*big) for x,y in zip(xs_,ys_)]
    for i in range(len(pts)-1):
        t=np.sin(np.pi*i/(len(pts)-1))      # taper at the ends
        w=int((1.8+2.2*t)*big)
        d.line([pts[i],pts[i+1]],fill=(74,38,22,255),width=max(w,2))
    # tiny lash flick on the outer corner
    ox,oy=(pts[0] if name=='L' else pts[-1])
    sgn=-1 if name=='L' else 1
    d.line([(ox,oy),(ox+sgn*3*big,oy-2.5*big)],fill=(74,38,22,255),width=int(1.8*big))
lid=lid.resize((W,H),Image.LANCZOS)
base=Image.fromarray(inp).convert('RGBA'); base.alpha_composite(lid)
# overlay = only the grown eye regions, soft edge
alpha=ndimage.gaussian_filter(grow.astype(float),0.8); alpha=np.clip(alpha*1.2,0,1)
ov=np.array(base); ov[...,3]=(alpha*255).astype(np.uint8)
ov[ov[...,3]==0]=0  # keep the file tiny: no colour data outside the eyes
OUT.mkdir(exist_ok=True)
Image.fromarray(ov).save(OUT/'eyes-closed.webp',format='WEBP',lossless=True,method=6)
print('Wrote',OUT/'eyes-closed.webp')
