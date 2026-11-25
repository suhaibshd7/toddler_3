#!/usr/bin/env python3
"""Build js/mouth-envelopes.js from the local MP3 clips.

Authoring utility only: the game never runs Python or ffmpeg. It reads every
clip registered in js/game-data.js, measures loudness over time (and a rough
spectral "darkness" cue), and writes one character per STEP_MS naming which of
the six mouth overlays to show:

  0 closed   1 slight   2 medium   3 wide   4 rounded-O   5 happy

This is loudness-driven movement, NOT phoneme-accurate Arabic lip-sync.
Precomputing keeps the game offline-first and independent of Web Audio, which
can silence audio on file:// pages. Re-run this script whenever MP3s are added
or replaced; clips without an envelope fall back to the older random mouth.

Requires: ffmpeg on PATH, Python 3, numpy.
Usage:    python tools/build_mouth_envelopes.py [--report]
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
STEP_MS = 40            # one output character per 40 ms
WIN_MS = 25             # analysis window
SR = 16000              # analysis sample rate
MIN_HOLD_STEPS = 2      # a state must last >= 80 ms (avoids flicker)
SILENCE_DB = -42.0      # below this (relative to clip peak) the mouth is closed
SLIGHT_DB = -26.0       # onset/decay tails -> slightly open
MEDIUM_DB = -9.0        # at/above this the mouth is wide; between is medium
ROUND_CENTROID_HZ = 520  # dark (low-centroid) vowels -> rounded O
ROUND_MIN_DB = -22.0
# Praise clips use the happy open mouth instead of plain wide.
HAPPY_PREFIXES = ('praise.', 'instruction.good_very_good', 'instruction.you_did_well')
NOT_HAPPY = ('praise.try_again',)


def load_clips():
    text = (ROOT / 'js' / 'game-data.js').read_text(encoding='utf-8')
    block = text[text.index('audio: {'):]
    block = block[:block.index('}')]
    return dict(re.findall(r"'([\w.]+)':\s*'([^']+\.mp3)'", block))


def decode(path):
    cmd = ['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le',
           '-ac', '1', '-ar', str(SR), '-']
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def analyse(samples):
    """Per output step: mean loudness (dB source) and spectral centroid."""
    win = int(SR * WIN_MS / 1000)
    hop = int(SR * STEP_MS / 1000)
    blk = int(SR * 0.010)  # 10 ms RMS blocks, averaged per step (in power)
    n_steps = max(1, int(np.ceil(len(samples) / hop)))
    rms = np.zeros(n_steps)
    centroid = np.zeros(n_steps)
    freqs = np.fft.rfftfreq(win, 1 / SR)
    hann = np.hanning(win)
    for i in range(n_steps):
        seg_all = samples[i * hop:(i + 1) * hop]
        if len(seg_all) == 0:
            continue
        blocks = [seg_all[j:j + blk] for j in range(0, len(seg_all), blk) if len(seg_all[j:j + blk])]
        rms[i] = np.sqrt(np.mean([np.mean(b ** 2) for b in blocks]))
        centre = i * hop + hop // 2
        seg = samples[max(0, centre - win // 2):centre + win // 2]
        if len(seg) < win:
            seg = np.pad(seg, (0, win - len(seg)))
        mag = np.abs(np.fft.rfft(seg * hann))
        centroid[i] = (freqs * mag).sum() / mag.sum() if mag.sum() > 1e-9 else 0
    return rms, centroid


def to_states(rms, centroid, happy):
    peak = rms.max() if rms.max() > 0 else 1.0
    db = 20 * np.log10(np.maximum(rms / peak, 1e-6))
    sm = db  # no extra smoothing: syllable dips are what make the mouth move
    states = []
    for d, c in zip(sm, centroid):
        if d < SILENCE_DB:
            s = 0
        elif d < SLIGHT_DB:
            s = 1
        elif d < MEDIUM_DB:
            s = 2
        else:
            s = 5 if happy else 3
        if s >= 2 and d >= ROUND_MIN_DB and 0 < c < ROUND_CENTROID_HZ:
            s = 4
        states.append(s)
    # Enforce a minimum dwell time: absorb runs shorter than MIN_HOLD_STEPS
    # into the previous state (the first run is absorbed into the next).
    runs = []
    for s in states:
        if runs and runs[-1][0] == s:
            runs[-1][1] += 1
        else:
            runs.append([s, 1])
    for i, run in enumerate(runs):
        if run[1] < MIN_HOLD_STEPS:
            run[0] = runs[i - 1][0] if i > 0 else (runs[i + 1][0] if len(runs) > 1 else run[0])
    return ''.join(str(s) * n for s, n in runs)


def main():
    report = '--report' in sys.argv
    clips = load_clips()
    out = {}
    for clip_id, rel in sorted(clips.items()):
        path = ROOT / rel
        samples = decode(path)
        rms, centroid = analyse(samples)
        happy = clip_id.startswith(HAPPY_PREFIXES) and clip_id not in NOT_HAPPY
        env = to_states(rms, centroid, happy)
        out[clip_id] = env
        if report:
            open_ratio = sum(ch != '0' for ch in env) / len(env)
            print(f'{clip_id:36s} {len(env) * STEP_MS:5d} ms  open {open_ratio:4.0%}  {env}')
    body = json.dumps({'stepMs': STEP_MS, 'clips': out}, ensure_ascii=False, indent=1)
    (ROOT / 'js' / 'mouth-envelopes.js').write_text(
        '/* Generated by tools/build_mouth_envelopes.py. Do not edit by hand. */\n'
        'window.MOUTH_ENVELOPES = ' + body + ';\n', encoding='utf-8')
    print(f'Wrote js/mouth-envelopes.js for {len(out)} clips.')


if __name__ == '__main__':
    main()
