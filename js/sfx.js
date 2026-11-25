/* Tiny synthesized sound effects (Web Audio oscillators; no files, no network).
   Speech still comes only from the local MP3 clips in audio.js. Effects can be
   switched off from the home screen; the choice is remembered on this device. */
(function () {
  'use strict';
  const STORAGE_KEY = 'arabic-learning-game-sfx-v1';
  let context = null;
  let enabled = readEnabled();

  function readEnabled() {
    try { return window.localStorage.getItem(STORAGE_KEY) !== 'off'; } catch (_) { return true; }
  }

  function getContext() {
    if (context) return context;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    try { context = new Ctor(); } catch (_) { context = null; }
    return context;
  }

  // A soft bubble "pop": a short sine blip that drops in pitch. A small random
  // pitch change keeps repeated taps from sounding mechanical.
  function pop() {
    if (!enabled) return;
    const audio = getContext();
    if (!audio) return;
    try {
      if (audio.state === 'suspended') audio.resume().catch(() => {});
      const now = audio.currentTime;
      const base = 560 * (0.94 + Math.random() * 0.12);
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(base * 1.55, now);
      osc.frequency.exponentialRampToValueAtTime(base * 0.6, now + 0.09);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.13, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    } catch (error) {
      console.warn('Sound effect failed:', error);
    }
  }

  function isEnabled() { return enabled; }

  function setEnabled(value) {
    enabled = Boolean(value);
    try { window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off'); } catch (_) {}
  }

  window.GameSfx = { pop, isEnabled, setEnabled };
})();
