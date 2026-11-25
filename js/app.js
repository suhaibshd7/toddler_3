/* Arabic Learning Game v9.19 — second-mistake feedback and listen-before-tap input lock. */
(function () {
  'use strict';

  const DATA = window.LEARNING_GAME;
  const STORAGE_KEY = 'arabic-learning-game-progress-v1';
  const $ = (id) => document.getElementById(id);
  const screens = { home: $('homeScreen'), game: $('gameScreen') };
  const catCompanion = $('catCompanion');
  const catSpeechText = $('catSpeechText');
  const catCharacterButton = $('catCharacterButton');
  const catCharacterImage = $('catCharacterImage');
  const catMouthImage = $('catMouthImage');
  const catBlinkImage = $('catBlinkImage');
  const catMouthFrames = [
    'assets/cat/mouth/frame-01-closed.webp',
    'assets/cat/mouth/frame-02-slight.webp',
    'assets/cat/mouth/frame-03-medium.webp',
    'assets/cat/mouth/frame-04-wide.webp',
    'assets/cat/mouth/frame-05-rounded-o.webp',
    'assets/cat/mouth/frame-06-happy.webp'
  ];
  let catMouthTimer = null;
  let catMouthRaf = null;
  let catMouthToken = 0;
  const catMouthPreloads = catMouthFrames.map((src) => {
    const image = new Image();
    image.src = src;
    return image;
  });
  function stopCatMouth() {
    if (catMouthTimer !== null) window.clearTimeout(catMouthTimer);
    catMouthTimer = null;
    if (catMouthRaf !== null) window.cancelAnimationFrame(catMouthRaf);
    catMouthRaf = null;
    catMouthToken += 1;
    if (catMouthImage) catMouthImage.src = catMouthFrames[0];
  }

  // Envelope-driven mouth: js/mouth-envelopes.js holds one digit (0-5, the index
  // of catMouthFrames) per stepMs for every clip, precomputed from the MP3 by
  // tools/build_mouth_envelopes.py. The audio element's own clock selects the
  // digit, so the mouth stays locked to the sound and needs no Web Audio.
  function getMouthEnvelope(audioId) {
    const data = window.MOUTH_ENVELOPES;
    if (!data || !data.clips || typeof data.clips[audioId] !== 'string') return null;
    return { stepMs: data.stepMs || 40, states: data.clips[audioId] };
  }

  function runEnvelopeMouth(token, envelope, audio) {
    let lastIndex = -1;
    const frame = () => {
      if (token !== catMouthToken || catCompanion.dataset.speaking !== 'true') return;
      const step = Math.floor((audio.currentTime * 1000) / envelope.stepMs);
      const digit = step >= envelope.states.length ? 0 : Number(envelope.states[Math.max(0, step)]);
      const frameIndex = digit >= 0 && digit < catMouthFrames.length ? digit : 0;
      if (frameIndex !== lastIndex) {
        catMouthImage.src = catMouthFrames[frameIndex];
        lastIndex = frameIndex;
      }
      catMouthRaf = window.requestAnimationFrame(frame);
    };
    frame();
  }

  function startCatMouth(speech) {
    if (!catMouthImage) return;
    stopCatMouth();
    const token = catMouthToken;

    // Reduced-motion users still get a readable speaking pose, without cycling.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      catMouthImage.src = catMouthFrames[2];
      return;
    }

    // Preferred path: follow the real clip. Falls back to the older varied
    // random mouth when a clip has no envelope or no audio element is known.
    const envelope = speech && speech.audio && speech.audioId ? getMouthEnvelope(speech.audioId) : null;
    if (envelope) {
      runEnvelopeMouth(token, envelope, speech.audio);
      return;
    }

    let beat = 0;
    const chooseMouthFrame = () => {
      const value = Math.random();
      // Vary the shape and opening size rather than alternating a binary pair.
      // A closed/rest beat is inserted periodically to suggest natural pauses.
      if (beat > 0 && beat % 8 === 0 && value < 0.72) return 0;
      if (value < 0.18) return 1; // slight
      if (value < 0.52) return 2; // medium
      if (value < 0.68) return 3; // wide emphasis
      if (value < 0.82) return 4; // rounded vowel
      return 5; // happy open / tongue
    };

    const tick = () => {
      if (token !== catMouthToken || catCompanion.dataset.speaking !== 'true') return;
      const frameIndex = chooseMouthFrame();
      catMouthImage.src = catMouthFrames[frameIndex];
      beat += 1;
      const baseDurations = [145, 115, 135, 125, 135, 145];
      const delay = baseDurations[frameIndex] + Math.floor(Math.random() * 45);
      catMouthTimer = window.setTimeout(tick, delay);
    };

    // Begin with a gentle opening on the first audible sample.
    catMouthImage.src = catMouthFrames[1];
    catMouthTimer = window.setTimeout(tick, 125);
  }

  function setCatSpeaking(isSpeaking, speech) {
    catCompanion.dataset.speaking = isSpeaking ? 'true' : 'false';
    if (isSpeaking) startCatMouth(speech);
    else stopCatMouth();
  }

  // Idle blink: a closed-eyes overlay aligned with the idle pose (wave frame 1).
  // It only runs while that pose is showing; the other wave frames are separate
  // drawings, so any wave immediately cancels a blink in progress.
  let catBlinkTimer = null;
  let catBlinkHideTimer = null;

  function hideCatBlink() {
    if (catBlinkHideTimer !== null) window.clearTimeout(catBlinkHideTimer);
    catBlinkHideTimer = null;
    if (catBlinkImage) catBlinkImage.classList.remove('is-blinking');
  }

  function blinkCat(doubleBlink) {
    if (!catBlinkImage || document.hidden || catWavePlaying) return;
    if (catCharacterImage.getAttribute('src') !== catWaveFrames[0]) return;
    catBlinkImage.classList.add('is-blinking');
    catBlinkHideTimer = window.setTimeout(() => {
      hideCatBlink();
      if (doubleBlink) catBlinkHideTimer = window.setTimeout(() => blinkCat(false), 140);
    }, 120);
  }

  function scheduleCatBlink() {
    if (!catBlinkImage) return;
    // Reduced-motion users keep a still face.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (catBlinkTimer !== null) window.clearTimeout(catBlinkTimer);
    catBlinkTimer = window.setTimeout(() => {
      blinkCat(Math.random() < 0.18);
      scheduleCatBlink();
    }, 2800 + Math.floor(Math.random() * 3600));
  }

  const catWaveFrames = Array.from({ length: 9 }, (_, index) => `assets/cat/wave/frame-${String(index + 1).padStart(2, '0')}.webp`);
  const catWaveSequence = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0];
  const catWaveDurations = [360, 150, 140, 140, 160, 160, 160, 160, 140, 140, 140, 150, 360];
  let catWaveTimer = null;
  let catWaveToken = 0;
  let catWavePlaying = false;

  // Preload each pose so frame changes are immediate, including offline.
  const catWavePreloads = catWaveFrames.map((src) => {
    const image = new Image();
    image.src = src;
    return image;
  });

  function stopCatWave(reset = true) {
    if (catWaveTimer !== null) window.clearTimeout(catWaveTimer);
    catWaveTimer = null;
    catWavePlaying = false;
    catWaveToken += 1;
    if (reset && catCharacterImage) catCharacterImage.src = catWaveFrames[0];
  }

  function playCatWave() {
    if (!catCharacterImage) return;
    hideCatBlink();
    stopCatWave(false);
    const token = catWaveToken;
    let step = 0;
    catWavePlaying = true;
    const tick = () => {
      if (token !== catWaveToken || !catWavePlaying) return;
      const frameIndex = catWaveSequence[step];
      catCharacterImage.src = catWaveFrames[frameIndex];
      step += 1;
      if (step >= catWaveSequence.length) {
        catWavePlaying = false;
        catWaveTimer = null;
        catCharacterImage.src = catWaveFrames[0];
        return;
      }
      catWaveTimer = window.setTimeout(tick, catWaveDurations[step - 1] || 150);
    };
    tick();
  }

  const catSlots = { home: $('homeCatSlot'), game: $('gameCatSlot') };
  const celebrationStyles = ['bounce', 'wiggle', 'clap', 'twirl'];
  let celebrationIndex = 0;
  let catTapCount = 0;
  let catInteractionToken = 0;
  let catIdleTimer = null;
  let catIdleActionTimer = null;
  let catIdleActionToken = 0;
  let catPointResetTimer = null;
  let roundEntryTimer = null;
  let catSpeechToken = 0;

  function newActivityProgress() {
    return { roundsCompleted: 0, choiceCount: 2, recentResults: [] };
  }

  // The card layout is designed for 2-6 choices. Activities may have more items
  // than this (e.g. the full alphabet), but a round never shows more than this.
  const MAX_CHOICES = 6;

  function normalizeActivityProgress(saved, maxChoices) {
    maxChoices = Math.min(maxChoices, MAX_CHOICES);
    const source = saved && typeof saved === 'object' ? saved : {};
    return {
      roundsCompleted: Number.isInteger(source.roundsCompleted) && source.roundsCompleted >= 0
        ? source.roundsCompleted : 0,
      choiceCount: Number.isInteger(source.choiceCount)
        ? Math.min(maxChoices, Math.max(2, source.choiceCount)) : 2,
      recentResults: Array.isArray(source.recentResults)
        ? source.recentResults.filter((value) => typeof value === 'boolean').slice(-5) : []
    };
  }

  function readProgress() {
    const fallback = {
      showLabels: false,
      activities: {
        animals: newActivityProgress(),
        colors: newActivityProgress(),
        shapes: newActivityProgress(),
        numbers: newActivityProgress(),
        letters: newActivityProgress()
      }
    };

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return fallback;

      const savedActivities = saved.activities && typeof saved.activities === 'object'
        ? saved.activities : null;
      // Migrate the original single-activity progress without losing the animal game's history.
      const legacyAnimals = savedActivities ? savedActivities.animals : saved;
      return {
        showLabels: saved.showLabels === true,
        activities: {
          animals: normalizeActivityProgress(legacyAnimals, DATA.activities.animals.items.length),
          colors: normalizeActivityProgress(savedActivities && savedActivities.colors, DATA.activities.colors.items.length),
          shapes: normalizeActivityProgress(savedActivities && savedActivities.shapes, DATA.activities.shapes.items.length),
          numbers: normalizeActivityProgress(savedActivities && savedActivities.numbers, DATA.activities.numbers.items.length),
          letters: normalizeActivityProgress(savedActivities && savedActivities.letters, DATA.activities.letters.items.length)
        }
      };
    } catch (_) {
      return fallback;
    }
  }

  const progress = readProgress();
  const state = {
    active: false,
    activityId: 'animals',
    items: DATA.activities.animals.items,
    target: null,
    options: [],
    lastTargetId: null,
    targetDeck: [],
    roundToken: 0,
    locked: false,
    waitingAfterWrong: false,
    wrongAttempts: 0,
    firstTryCorrect: null,
    promptReady: false,
    greetedThisSession: false,
    sessionRounds: 0,
    sessionPaused: false,
    sessionEnded: false
  };

  function currentActivity() {
    return DATA.activities[state.activityId];
  }

  function currentProgress() {
    return progress.activities[state.activityId];
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn('Could not save local progress:', error);
    }
    renderParentInfo();
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function setScreen(name) {
    document.body.classList.toggle('game-active', name === 'game');
    Object.entries(screens).forEach(([key, element]) => {
      element.hidden = key !== name;
    });
    // Keep one character instance, but place it in the visual center of the
    // currently visible screen instead of pinning it to a screen corner.
    const slot = catSlots[name];
    if (slot && catCompanion.parentElement !== slot) slot.appendChild(catCompanion);
    catCompanion.dataset.screen = name;
  }

  function formatChoiceCount(count) {
    return count === 2 ? 'خياران' : `${count} خيارات`;
  }

  const SESSION_LENGTH = 15;
  function updateSessionProgress() {
    const stars = $('sessionStars').querySelectorAll('.session-star');
    stars.forEach((star, index) => {
      star.classList.toggle('is-filled', index < state.sessionRounds);
    });
    $('sessionProgressLabel').textContent = `${state.sessionRounds} / ${SESSION_LENGTH}`;
  }

  function renderParentInfo() {
    const activityProgress = currentProgress();
    $('parentRounds').textContent = String(activityProgress.roundsCompleted);
    $('parentChoices').textContent = String(activityProgress.choiceCount);
    const recent = activityProgress.recentResults;
    $('parentRecent').textContent = recent.length
      ? `${recent.filter(Boolean).length} / ${recent.length}`
      : 'لم تبدأ بعد';
    $('showLabelsToggle').checked = progress.showLabels;
    $('parentActivityName').textContent = currentActivity().title;
  }

  function showFeedback(message, kind) {
    const box = $('feedback');
    box.textContent = message || '';
    box.className = 'feedback' + (kind ? ` ${kind}` : '');
  }

  // Answer cards are only active after the child has heard the target prompt.
  function setChoicesEnabled(enabled) {
    $('choices').querySelectorAll('button').forEach((button) => {
      button.disabled = !enabled;
    });
  }

  function setCatMessage(message, mood = 'idle', options = {}) {
    if (message) catSpeechText.textContent = message;

    // Cancel a previous timed idle/pointing pose so an older timer can never
    // overwrite a newer reaction.
    if (catIdleActionTimer) window.clearTimeout(catIdleActionTimer);
    catIdleActionTimer = null;
    catIdleActionToken += 1;
    if (catPointResetTimer) window.clearTimeout(catPointResetTimer);
    catPointResetTimer = null;

    if (options.celebration) catCompanion.dataset.celebration = options.celebration;
    else if (mood !== 'celebrating') delete catCompanion.dataset.celebration;

    const nextMood = mood || 'idle';
    if (nextMood === 'greeting' || nextMood === 'tiny-wave' || nextMood === 'celebrating') playCatWave();
    if (catCompanion.dataset.mood !== nextMood) {
      // A short neutral frame lets the next CSS choreography enter cleanly
      // instead of snapping between expressions.
      catCompanion.dataset.mood = 'transitioning';
      void catCompanion.offsetWidth;
    }
    catCompanion.dataset.mood = nextMood;
  }

  let catGazeResetTimer = null;
  function resetCatGaze(delay = 900) {
    if (catGazeResetTimer) window.clearTimeout(catGazeResetTimer);
    catGazeResetTimer = window.setTimeout(() => {
      catCompanion.style.setProperty('--cat-gaze-x', '0px');
      catCompanion.style.setProperty('--cat-gaze-y', '0px');
      catGazeResetTimer = null;
    }, delay);
  }

  function makeCatLookAtPoint(clientX, clientY, resetDelay = 1500) {
    if (!catCharacterButton) return;
    const catRect = catCharacterButton.getBoundingClientRect();
    if (!catRect.width || !catRect.height) return;

    const catX = catRect.left + catRect.width / 2;
    const catY = catRect.top + catRect.height * 0.39;
    const gazeX = Math.max(-3.6, Math.min(3.6, ((clientX - catX) / catRect.width) * 13));
    const gazeY = Math.max(-2.4, Math.min(3.4, ((clientY - catY) / catRect.height) * 10));

    if (catGazeResetTimer) window.clearTimeout(catGazeResetTimer);
    catGazeResetTimer = null;
    catCompanion.style.setProperty('--cat-gaze-x', `${gazeX.toFixed(1)}px`);
    catCompanion.style.setProperty('--cat-gaze-y', `${gazeY.toFixed(1)}px`);
    if (resetDelay > 0) resetCatGaze(resetDelay);
  }

  function makeCatLookAt(element, resetDelay = 1500) {
    if (!element) return;
    const targetRect = element.getBoundingClientRect();
    if (!targetRect.width || !targetRect.height) return;
    makeCatLookAtPoint(
      targetRect.left + targetRect.width / 2,
      targetRect.top + targetRect.height / 2,
      resetDelay
    );
  }

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  // Keep the cat's mouth animation tied to the actual HTML audio playback
  // lifecycle, not merely to the moment a clip is requested. A token prevents
  // an older clip's completion from closing the mouth during newer speech.
  function stopCatSpeech() {
    catSpeechToken += 1;
    setCatSpeaking(false);
  }

  function playCatAudio(audioId, options = {}) {
    const token = ++catSpeechToken;
    const guard = typeof options.guard === 'function' ? options.guard : () => true;
    const animateMouth = options.animateMouth !== false;
    setCatSpeaking(false);

    const play = options.optional ? LocalAudio.playOptional : LocalAudio.play;
    return play(audioId, (audioElement) => {
      if (token !== catSpeechToken || !guard()) return;
      setCatSpeaking(animateMouth, { audioId, audio: audioElement });
      if (typeof options.onStart === 'function') options.onStart();
    }).finally(() => {
      if (token === catSpeechToken) setCatSpeaking(false);
    });
  }

  function stopAllAudio() {
    stopCatSpeech();
    LocalAudio.stop();
  }

  async function interactWithCat() {
    // On the home screen, taps trigger a rotating set of playful reactions.
    // During a round, tapping the cat replays the target word after a brief pet.
    if (state.active) {
      if (!state.target || !state.promptReady || state.locked || state.waitingAfterWrong) return;
      const token = state.roundToken;
      state.promptReady = false;
      playCatWave();
      setCatMessage('هيا نسمعها معاً!', 'petted');
      await wait(360);
      if (token !== state.roundToken || !state.active || state.locked) return;
      await playTargetWord();
      return;
    }

    catTapCount += 1;
    const reactions = ['greeting', 'playful', 'curious', 'tiny-wave'];
    const mood = reactions[(catTapCount - 1) % reactions.length];
    if (mood !== 'greeting' && mood !== 'tiny-wave') playCatWave();
    const interactionToken = ++catInteractionToken;
    setCatMessage('مرحباً!', mood);
    const result = await playCatAudio('instruction.hello');
    if (interactionToken === catInteractionToken && !state.active) {
      setCatMessage('مرحباً!', 'idle');
    }
    return result;
  }

  function scheduleCatIdleMoment() {
    if (catIdleTimer) window.clearTimeout(catIdleTimer);
    catIdleTimer = window.setTimeout(() => {
      if (!document.hidden && catCompanion.dataset.mood === 'idle') {
        // Small non-verbal moments keep the guide alive without distracting
        // from the learning choices or adding more audio.
        const homeActions = ['curious', 'playful', 'tiny-wave'];
        const gameActions = ['curious', 'playful'];
        const choices = state.active ? gameActions : homeActions;
        const mood = choices[Math.floor(Math.random() * choices.length)];
        const duration = mood === 'curious' ? 1050 : 900;
        setCatMessage('', mood);
        const actionToken = catIdleActionToken;
        catIdleActionTimer = window.setTimeout(() => {
          if (actionToken === catIdleActionToken && catCompanion.dataset.mood === mood) {
            setCatMessage('', 'idle');
          }
          catIdleActionTimer = null;
        }, duration);
      }
      scheduleCatIdleMoment();
    }, 6800 + Math.floor(Math.random() * 4200));
  }

  async function playCatLine(audioId, message, mood, token) {
    // Greeting gestures begin when the recording really starts. The brief
    // thinking pose avoids a talking mouth during slow file/decoder startup.
    const waitingMood = mood === 'greeting' ? 'thinking' : mood;
    setCatMessage(message, waitingMood);
    const result = await playCatAudio(audioId, {
      guard: () => token === state.roundToken && state.active,
      animateMouth: mood !== 'oops',
      onStart: mood === 'greeting'
        ? () => setCatMessage(message, 'greeting')
        : undefined
    });
    if (token === state.roundToken) setCatMessage(message, 'idle');
    return result;
  }

  async function introduceActivity(token) {
    if (state.greetedThisSession === false) {
      await playCatLine('instruction.hello', 'مرحباً!', 'greeting', token);
      if (token !== state.roundToken || !state.active || document.hidden) return;
      state.greetedThisSession = true;
    }

    await playCatLine('instruction.lets_play', 'هيا نلعب!', 'greeting', token);
    if (token !== state.roundToken || !state.active || document.hidden) return;
    await playTargetWord();
  }

  function chooseTarget() {
    // Deal from a shuffled deck so every item is used once before any item
    // repeats. At a deck boundary, swap the first card if it would repeat
    // the previous target from the end of the last deck.
    if (!state.targetDeck.length) {
      state.targetDeck = shuffle(state.items);
      if (state.targetDeck.length > 1 && state.targetDeck[0].id === state.lastTargetId) {
        const swapIndex = 1 + Math.floor(Math.random() * (state.targetDeck.length - 1));
        [state.targetDeck[0], state.targetDeck[swapIndex]] = [state.targetDeck[swapIndex], state.targetDeck[0]];
      }
    }
    return state.targetDeck.shift();
  }

  function createShapeArtwork(item) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'shape-art');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');

    let shape;
    if (item.shape === 'circle') {
      shape = document.createElementNS(svgNS, 'circle');
      shape.setAttribute('cx', '60');
      shape.setAttribute('cy', '60');
      shape.setAttribute('r', '43');
    } else if (item.shape === 'square') {
      shape = document.createElementNS(svgNS, 'rect');
      shape.setAttribute('x', '18');
      shape.setAttribute('y', '18');
      shape.setAttribute('width', '84');
      shape.setAttribute('height', '84');
      shape.setAttribute('rx', '9');
    } else if (item.shape === 'triangle') {
      shape = document.createElementNS(svgNS, 'path');
      shape.setAttribute('d', 'M60 13 L109 104 H11 Z');
    } else if (item.shape === 'star') {
      shape = document.createElementNS(svgNS, 'path');
      shape.setAttribute('d', 'M60 8 L73 43 L111 45 L82 69 L91 107 L60 86 L29 107 L38 69 L9 45 L47 43 Z');
    }

    if (shape) {
      shape.setAttribute('fill', item.color);
      shape.setAttribute('stroke', 'rgba(255,255,255,.88)');
      shape.setAttribute('stroke-width', '4');
      shape.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(shape);
    }
    return svg;
  }

  function createNumberArtwork(item) {
    const wrap = document.createElement('div');
    wrap.className = 'number-art';
    wrap.setAttribute('aria-hidden', 'true');

    const digit = document.createElement('span');
    digit.className = 'number-digit';
    digit.textContent = item.numeral;
    wrap.appendChild(digit);

    const quantity = document.createElement('span');
    quantity.className = 'number-quantity';
    quantity.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < item.count; index += 1) {
      const dot = document.createElement('span');
      dot.className = 'number-dot';
      quantity.appendChild(dot);
    }
    wrap.appendChild(quantity);
    return wrap;
  }

  function createLetterArtwork(item) {
    const wrap = document.createElement('div');
    wrap.className = 'letter-art';
    wrap.setAttribute('aria-hidden', 'true');

    const glyph = document.createElement('span');
    glyph.className = 'letter-glyph';
    glyph.textContent = item.letter;
    wrap.appendChild(glyph);

    const accent = document.createElement('span');
    accent.className = 'letter-accent';
    accent.textContent = '✦';
    accent.setAttribute('aria-hidden', 'true');
    wrap.appendChild(accent);
    return wrap;
  }

  function renderOptions() {
    const host = $('choices');
    const isColorActivity = state.activityId === 'colors';
    const isShapeActivity = state.activityId === 'shapes';
    const isNumberActivity = state.activityId === 'numbers';
    const isLetterActivity = state.activityId === 'letters';
    host.replaceChildren();
    host.classList.remove('round-enter');
    if (roundEntryTimer) window.clearTimeout(roundEntryTimer);

    state.options.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.disabled = !state.promptReady || state.locked || state.waitingAfterWrong;
      button.className = 'choice-card';
      if (isColorActivity) button.classList.add('color-choice-card');
      if (isShapeActivity) button.classList.add('shape-choice-card');
      if (isNumberActivity) button.classList.add('number-choice-card');
      if (isLetterActivity) button.classList.add('letter-choice-card');
      button.dataset.itemId = item.id;
      button.setAttribute('aria-label', item.word);
      button.setAttribute('aria-posinset', String(index + 1));
      button.setAttribute('aria-setsize', String(state.options.length));

      if (isColorActivity) {
        const swatch = document.createElement('span');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = item.color;
        swatch.setAttribute('aria-hidden', 'true');
        button.appendChild(swatch);
      } else if (isShapeActivity) {
        button.appendChild(createShapeArtwork(item));
      } else if (isNumberActivity) {
        button.appendChild(createNumberArtwork(item));
      } else if (isLetterActivity) {
        button.appendChild(createLetterArtwork(item));
      } else {
        if (item.image) {
          const artwork = document.createElement('img');
          artwork.className = 'animal-art';
          artwork.src = item.image;
          artwork.alt = '';
          artwork.setAttribute('aria-hidden', 'true');
          artwork.width = 512;
          artwork.height = 512;
          artwork.decoding = 'async';
          artwork.addEventListener('error', () => {
            const fallback = document.createElement('span');
            fallback.className = 'animal-emoji';
            fallback.setAttribute('aria-hidden', 'true');
            fallback.textContent = item.emoji || '🐾';
            artwork.replaceWith(fallback);
          }, { once: true });
          button.appendChild(artwork);
        } else {
          const emoji = document.createElement('span');
          emoji.className = 'animal-emoji';
          emoji.setAttribute('aria-hidden', 'true');
          emoji.textContent = item.emoji || '🐾';
          button.appendChild(emoji);
        }
      }

      if (progress.showLabels) {
        const label = document.createElement('span');
        label.className = 'animal-label';
        label.textContent = item.word;
        button.appendChild(label);
      }

      button.addEventListener('pointerenter', (event) => makeCatLookAtPoint(event.clientX, event.clientY, 1800));
      button.addEventListener('pointermove', (event) => makeCatLookAtPoint(event.clientX, event.clientY, 1800));
      button.addEventListener('pointerdown', (event) => makeCatLookAtPoint(event.clientX, event.clientY, 2200));
      button.addEventListener('focus', () => makeCatLookAt(button, 2200));
      button.addEventListener('pointerleave', () => resetCatGaze(700));
      button.addEventListener('blur', () => resetCatGaze(700));
      button.addEventListener('click', () => answer(item, button));
      host.appendChild(button);
    });

    host.dataset.choiceCount = String(state.options.length);
    host.dataset.activity = state.activityId;
    $('levelPill').textContent = formatChoiceCount(state.options.length);
    $('choicesInstruction').textContent = currentActivity().choiceInstruction;
    $('choices').setAttribute('aria-label', currentActivity().title);
    void host.offsetWidth;
    host.classList.add('round-enter');
    roundEntryTimer = window.setTimeout(() => {
      host.classList.remove('round-enter');
      roundEntryTimer = null;
    }, 520);
  }

  function startGame(activityId) {
    const activity = DATA.activities[activityId];
    if (!activity) return;

    catInteractionToken += 1;
    stopAllAudio();
    state.active = true;
    state.activityId = activityId;
    state.items = activity.items;
    state.lastTargetId = null;
    state.targetDeck = [];
    state.sessionRounds = 0;
    state.sessionPaused = false;
    state.sessionEnded = false;
    screens.game.classList.remove('session-ended', 'session-finale');
    $('sessionEnd').hidden = true;
    updateSessionProgress();

    $('gameTitle').textContent = activity.title;
    $('gameHeadingIcon').textContent = activity.icon;
    $('speakerButton').disabled = true;
    setScreen('game');
    renderParentInfo();
    const token = nextRound({ playPrompt: false });
    introduceActivity(token);
  }

  function nextRound(options = {}) {
    if (!state.active || state.sessionEnded) return;
    $('sessionEnd').hidden = true;
    screens.game.classList.remove('session-ended', 'session-finale');
    state.sessionPaused = false;
    state.roundToken += 1;
    stopAllAudio();
    state.locked = false;
    state.waitingAfterWrong = false;
    state.wrongAttempts = 0;
    state.firstTryCorrect = null;
    state.promptReady = false;
    state.target = chooseTarget();
    state.lastTargetId = state.target.id;

    const activityProgress = currentProgress();
    const distractors = shuffle(state.items.filter((item) => item.id !== state.target.id))
      .slice(0, activityProgress.choiceCount - 1);
    state.options = shuffle([state.target, ...distractors]);

    renderOptions();
    setChoicesEnabled(false);
    showFeedback('');
    $('gameRounds').textContent = String(activityProgress.roundsCompleted);
    $('speakerButton').disabled = true;
    $('speakerButton').classList.remove('is-playing');
    if (options.playPrompt !== false) playTargetWord();
    return state.roundToken;
  }

  async function playTargetWord() {
    if (!state.target || !state.active || state.locked) return;
    const token = state.roundToken;
    state.promptReady = false;
    setChoicesEnabled(false);
    $('speakerButton').disabled = true;
    $('speakerButton').classList.add('is-playing');
    makeCatLookAt($('choices'), 0);
    setCatMessage('اسمع الكلمة!', 'thinking');
    const result = await playCatAudio(state.target.audioId, {
      guard: () => token === state.roundToken && state.active && !state.locked,
      onStart: () => setCatMessage('اسمع الكلمة!', 'speaking')
    });
    if (token !== state.roundToken || !state.active) return;
    $('speakerButton').classList.remove('is-playing');
    $('speakerButton').disabled = false;
    state.promptReady = result.played === true;
    setChoicesEnabled(state.promptReady);

    if (state.promptReady) {
      // Once the word is heard, the cat gives a brief general gesture toward
      // the answer area. It looks at the whole choice group, never the answer.
      makeCatLookAt($('choices'), 0);
      setCatMessage('اختر الآن!', 'pointing');
      catPointResetTimer = window.setTimeout(() => {
        if (token === state.roundToken && state.active && state.promptReady && !state.locked) {
          setCatMessage('', 'idle');
        }
        catPointResetTimer = null;
      }, 1350);
    } else {
      setCatMessage('اضغط على السماعة لنحاول مرة أخرى.', 'encouraging');
      showFeedback('اضغط على السماعة لسماع الكلمة مرة أخرى.', 'notice');
    }
  }

  function recordCompletedRound() {
    const activityProgress = currentProgress();
    activityProgress.roundsCompleted += 1;
    activityProgress.recentResults.push(state.firstTryCorrect === true);
    activityProgress.recentResults = activityProgress.recentResults.slice(-5);

    let levelChanged = false;
    if (activityProgress.recentResults.length === 5) {
      const correct = activityProgress.recentResults.filter(Boolean).length;
      if (correct >= 4 && activityProgress.choiceCount < Math.min(MAX_CHOICES, state.items.length)) {
        activityProgress.choiceCount += 1;
        activityProgress.recentResults = [];
        levelChanged = true;
      } else if (correct <= 2 && activityProgress.choiceCount > 2) {
        activityProgress.choiceCount -= 1;
        activityProgress.recentResults = [];
        levelChanged = true;
      }
    }

    saveProgress();
    $('gameRounds').textContent = String(activityProgress.roundsCompleted);
    return levelChanged;
  }

  function chooseCelebrationStyle() {
    const style = celebrationStyles[celebrationIndex % celebrationStyles.length];
    celebrationIndex += 1;
    return style;
  }

  async function answer(item, button) {
    if (!state.active || !state.promptReady || state.locked || state.waitingAfterWrong || !state.target) return;
    makeCatLookAt(button, 2400);

    if (item.id !== state.target.id) {
      state.wrongAttempts += 1;
      const isSecondMistake = state.wrongAttempts === 2;
      if (state.firstTryCorrect === null) state.firstTryCorrect = false;
      state.waitingAfterWrong = true;
      state.promptReady = false;
      setChoicesEnabled(false);
      $('speakerButton').disabled = true;
      button.classList.remove('wrong');
      void button.offsetWidth;
      button.classList.add('wrong');
      showFeedback('هيا نحاول مرة أخرى', 'gentle');
      const token = state.roundToken;
      // Say what was actually tapped (existing clip), so a mistake teaches that
      // card's name, then the usual encouragement and the target word again.
      setCatMessage(item.word, 'oops');
      await playCatAudio(item.audioId, {
        guard: () => token === state.roundToken && state.active
      });
      if (token !== state.roundToken || !state.active) return;
      await wait(180);
      if (token !== state.roundToken || !state.active) return;
      if (isSecondMistake) {
        // A distinct owner-supplied local recording is used on the second mistake.
        // The cat stays concerned and speaks through the normal synchronized path.
        setCatMessage('لا بأس، لنستمع مرة أخرى!', 'oops');
        await playCatAudio('feedback.second_mistake', {
          guard: () => token === state.roundToken && state.active
        });
      } else {
        await playCatLine('praise.try_again', 'هيا نحاول مرة أخرى!', 'oops', token);
      }
      if (token !== state.roundToken || !state.active) return;
      state.waitingAfterWrong = false;
      await playTargetWord();
      return;
    }

    state.locked = true;
    state.promptReady = false;
    if (state.firstTryCorrect === null) state.firstTryCorrect = true;
    button.classList.add('correct');
    // Make the selected answer explicit to assistive technology as well as
    // showing the visual check mark; all choices remain locked for this beat.
    button.setAttribute('aria-label', 'إجابة صحيحة: ' + state.target.word);
    $('choices').querySelectorAll('button').forEach((choice) => { choice.disabled = true; });
    $('speakerButton').disabled = true;

    const praise = DATA.praise[Math.floor(Math.random() * DATA.praise.length)];
    showFeedback(praise.word + ' ' + state.target.word + ' ✨', 'success');
    setCatMessage(praise.word + '!', 'celebrating', { celebration: chooseCelebrationStyle() });
    recordCompletedRound();
    state.sessionRounds = Math.min(SESSION_LENGTH, state.sessionRounds + 1);
    updateSessionProgress();

    const token = state.roundToken;
    const result = await playCatAudio(praise.audioId, {
      guard: () => token === state.roundToken && state.active
    });
    if (token !== state.roundToken || !state.active) return;
    if (!result.played && !result.stopped) {
      showFeedback('أحسنت! ' + state.target.word + ' ✨', 'success');
    }

    // The fifteenth answer gets a distinct finale instead of immediately
    // dropping the cat back to idle.
    if (state.sessionRounds >= SESSION_LENGTH) {
      await wait(260);
      await endSession(token, praise.word);
      return;
    }

    // Let the celebration settle, give the cat a short curious transition,
    // then introduce the next round. Tokens cancel this sequence if the child
    // leaves or changes activity in the meantime.
    setCatMessage(praise.word + '!', 'ready-next');
    await wait(460);
    if (token !== state.roundToken || !state.active || state.sessionEnded) return;
    nextRound();
  }

  async function endSession(token, praiseWord) {
    if (token !== state.roundToken || !state.active || state.sessionEnded) return;
    state.sessionPaused = true;
    state.sessionEnded = true;
    state.promptReady = false;
    $('speakerButton').disabled = true;
    $('speakerButton').classList.remove('is-playing');
    $('choices').querySelectorAll('button').forEach((choice) => { choice.disabled = true; });
    screens.game.classList.add('session-ended', 'session-finale');
    $('sessionEnd').hidden = false;
    showFeedback('');
    setCatMessage('انتهت اللعبة!', 'celebrating', { celebration: 'grand' });

    // The user will add this recording later at the documented path. Until it
    // exists, the end screen and cat reaction still work silently.
    await playCatAudio('instruction.game_ended', {
      optional: true,
      guard: () => token === state.roundToken && state.active && state.sessionEnded
    });
    if (token !== state.roundToken || !state.active || !state.sessionEnded) return;
    // Keep the finale pose playing after the optional clip (or silently when
    // the file has not been supplied yet).
    catCompanion.dataset.mood = 'celebrating';
  }

  async function continueSession() {
    if (!state.active || !state.sessionPaused || !state.sessionEnded) return;
    const token = state.roundToken;
    state.sessionPaused = false;
    state.sessionEnded = false;
    state.sessionRounds = 0;
    updateSessionProgress();
    $('sessionEnd').hidden = true;
    screens.game.classList.remove('session-ended', 'session-finale');
    $('continueSessionButton').disabled = true;
    await playCatLine('instruction.lets_play', 'هيا نكمل اللعب!', 'greeting', token);
    $('continueSessionButton').disabled = false;
    if (token === state.roundToken && state.active) nextRound();
  }

  async function restartActivityFromBeginning() {
    if (!state.active || !state.sessionPaused || !state.sessionEnded) return;
    const token = state.roundToken;
    // This is the explicit "start over" choice: reset only the current
    // activity's saved learning history and difficulty, not the other activities.
    progress.activities[state.activityId] = newActivityProgress();
    state.sessionPaused = false;
    state.sessionEnded = false;
    state.sessionRounds = 0;
    state.lastTargetId = null;
    state.targetDeck = [];
    updateSessionProgress();
    saveProgress();
    $('gameRounds').textContent = '0';
    $('sessionEnd').hidden = true;
    screens.game.classList.remove('session-ended', 'session-finale');
    $('restartSessionButton').disabled = true;
    await playCatLine('instruction.lets_play', 'هيا نبدأ من جديد!', 'greeting', token);
    $('restartSessionButton').disabled = false;
    if (token === state.roundToken && state.active) nextRound();
  }

  async function leaveGame() {
    catInteractionToken += 1;
    if (document.fullscreenElement === screens.game && document.exitFullscreen) {
      try { await document.exitFullscreen(); } catch (_) {}
    }
    state.active = false;
    state.roundToken += 1;
    state.target = null;
    state.options = [];
    state.sessionRounds = 0;
    state.sessionPaused = false;
    state.sessionEnded = false;
    screens.game.classList.remove('session-ended', 'session-finale');
    $('sessionEnd').hidden = true;
    updateSessionProgress();
    stopAllAudio();
    $('speakerButton').classList.remove('is-playing');
    $('speakerButton').disabled = false;
    setScreen('home');
    if (catGazeResetTimer) window.clearTimeout(catGazeResetTimer);
    catGazeResetTimer = null;
    catCompanion.style.setProperty('--cat-gaze-x', '0px');
    catCompanion.style.setProperty('--cat-gaze-y', '0px');
    setCatMessage('مرحباً من جديد!', 'greeting');
    playCatAudio('instruction.hello', { guard: () => !state.active }).then(() => {
      if (!state.active) setCatMessage('اختر نشاطاً لنلعب معاً!', 'idle');
    });
  }

  function resetProgress() {
    progress.activities[state.activityId] = newActivityProgress();
    state.sessionRounds = 0;
    state.sessionPaused = false;
    state.sessionEnded = false;
    screens.game.classList.remove('session-ended', 'session-finale');
    $('sessionEnd').hidden = true;
    updateSessionProgress();
    saveProgress();
    $('gameRounds').textContent = '0';
    if (state.active) nextRound();
    showFeedback('تمت إعادة ضبط تقدم هذا النشاط', 'notice');
  }

  function updateFullscreenButton() {
    const active = document.fullscreenElement === screens.game;
    const button = $('fullscreenButton');
    button.setAttribute('aria-label', active ? 'الخروج من ملء الشاشة' : 'ملء الشاشة');
    button.setAttribute('title', active ? 'الخروج من ملء الشاشة' : 'ملء الشاشة');
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    button.querySelector('span[aria-hidden="true"]').textContent = active ? '⛶' : '⛶';
    button.querySelector('.fullscreen-button-label').textContent = active ? 'خروج' : 'ملء الشاشة';
  }

  async function toggleGameFullscreen() {
    try {
      if (document.fullscreenElement === screens.game) {
        await document.exitFullscreen();
      } else if (screens.game.requestFullscreen) {
        try {
          await screens.game.requestFullscreen({ navigationUI: 'hide' });
        } catch (_) {
          await screens.game.requestFullscreen();
        }
      } else {
        showFeedback('ملء الشاشة غير متاح في هذا المتصفح.', 'notice');
      }
    } catch (error) {
      console.warn('Could not toggle game fullscreen:', error);
      showFeedback('تعذّر فتح ملء الشاشة. جرّب متصفحاً آخر.', 'notice');
    }
    updateFullscreenButton();
  }

  function handleKeyboard(event) {
    if (!state.active || state.sessionEnded || !/^[1-6]$/.test(event.key)) return;
    const index = Number(event.key) - 1;
    const button = $('choices').querySelectorAll('button')[index];
    if (button && !button.disabled) button.click();
  }

  $('startButton').addEventListener('click', () => startGame('animals'));
  catCharacterButton.addEventListener('click', interactWithCat);
  document.querySelectorAll('button[data-activity]').forEach((button) => {
    button.addEventListener('click', () => startGame(button.dataset.activity));
  });
  $('homeButton').addEventListener('click', leaveGame);
  $('speakerButton').addEventListener('click', playTargetWord);
  $('continueSessionButton').addEventListener('click', continueSession);
  $('restartSessionButton').addEventListener('click', restartActivityFromBeginning);
  $('fullscreenButton').addEventListener('click', toggleGameFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  $('showLabelsToggle').addEventListener('change', (event) => {
    progress.showLabels = event.target.checked;
    saveProgress();
    if (state.active) renderOptions();
  });
  $('resetProgressButton').addEventListener('click', resetProgress);
  document.addEventListener('keydown', handleKeyboard);
  scheduleCatIdleMoment();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAllAudio();
      stopCatWave();
      state.promptReady = false;
      setChoicesEnabled(false);
      $('speakerButton').classList.remove('is-playing');
      if (state.active) {
        $('speakerButton').disabled = false;
        setCatMessage('اضغط على السماعة لسماع الكلمة مرة أخرى.', 'idle');
      }
    }
  });

  // Soft tap pop on answer cards and activity cards. pointerdown (not click)
  // so a toddler gets feedback the instant the finger lands.
  document.addEventListener('pointerdown', (event) => {
    const target = event.target && event.target.closest
      ? event.target.closest('#choices button, .activity-card') : null;
    if (target && !target.disabled && window.GameSfx) window.GameSfx.pop();
  });

  const sfxToggle = $('sfxToggle');
  function renderSfxToggle() {
    if (!sfxToggle || !window.GameSfx) return;
    const on = window.GameSfx.isEnabled();
    sfxToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    sfxToggle.setAttribute('aria-label', 'المؤثرات الصوتية: ' + (on ? 'تعمل' : 'متوقفة'));
    sfxToggle.querySelector('.sfx-toggle-icon').textContent = on ? '🔔' : '🔕';
  }
  if (sfxToggle) {
    sfxToggle.addEventListener('click', () => {
      window.GameSfx.setEnabled(!window.GameSfx.isEnabled());
      renderSfxToggle();
      window.GameSfx.pop(); // audible confirmation only when turned on
    });
    renderSfxToggle();
  }

  setCatSpeaking(false);
  if (catCharacterImage) catCharacterImage.src = catWaveFrames[0];
  scheduleCatBlink();
  setScreen('home');
  renderParentInfo();
  updateSessionProgress();
  updateFullscreenButton();
  setCatMessage('مرحباً!', 'idle');
  const preloadIds = [
    ...Object.values(DATA.activities).flatMap((activity) => activity.items.map((item) => item.audioId)),
    ...DATA.praise.map((item) => item.audioId),
    'feedback.second_mistake'
  ];
  LocalAudio.preload(preloadIds);
  document.documentElement.dataset.appReady = 'true';
})();
