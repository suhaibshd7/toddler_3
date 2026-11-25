/* Local MP3 playback. All assets are packaged with the project. */
(function () {
  'use strict';
  let activeAudio = null;
  let activeFinish = null;
  // Async optional-file checks must not be allowed to start stale audio after
  // a newer prompt or user action has already replaced it.
  let playbackRequestId = 0;

  function stopActive() {
    const audioToStop = activeAudio;
    const finishToStop = activeFinish;
    activeAudio = null;
    activeFinish = null;

    if (audioToStop) {
      try {
        audioToStop.pause();
        audioToStop.currentTime = 0;
      } catch (_) {}
    }
    if (finishToStop) finishToStop({ played: false, stopped: true });
  }

  function stop() {
    // Also invalidates any playOptional() request currently waiting on fetch().
    playbackRequestId += 1;
    stopActive();
  }

  function playFile(audioId, path, requestId, onStart) {
    if (requestId !== playbackRequestId) {
      return Promise.resolve({ played: false, stopped: true });
    }

    // The caller has already advanced the request ID and invalidated older
    // playback. Stop only the active element here without invalidating itself.
    stopActive();
    const audio = new Audio(path);
    audio.preload = 'auto';
    audio.volume = 1;
    activeAudio = audio;

    return new Promise((resolve) => {
      let finished = false;
      let started = false;
      const timeout = window.setTimeout(() => finish({ played: false, timeout: true }), 10000);

      function finish(result) {
        if (finished) return;
        finished = true;
        window.clearTimeout(timeout);
        audio.removeEventListener('playing', onPlaying);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        if (activeAudio === audio) activeAudio = null;
        if (activeFinish === finish) activeFinish = null;
        resolve(result);
      }
      function onPlaying() {
        if (finished || started || requestId !== playbackRequestId) return;
        started = true;
        if (typeof onStart === 'function') {
          try { onStart(audio); } catch (error) {
            console.warn('Audio start callback failed:', audioId, error);
          }
        }
      }
      function onEnded() { finish({ played: true }); }
      function onError() {
        console.warn('Could not play local audio:', audioId, path);
        finish({ played: false, error: true });
      }

      activeFinish = finish;
      audio.addEventListener('playing', onPlaying);
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);
      try {
        const playResult = audio.play();
        // The play() promise resolves once playback has started. Use it as a
        // fallback for engines that do not dispatch the `playing` event.
        if (playResult && typeof playResult.then === 'function') {
          playResult.then(onPlaying).catch((error) => {
            console.warn('Audio playback was blocked or failed:', audioId, error);
            finish({ played: false, blocked: true });
          });
        }
      } catch (error) {
        console.warn('Audio playback was blocked or failed:', audioId, error);
        finish({ played: false, blocked: true });
      }
    });
  }

  function play(audioId, onStart) {
    const path = window.LEARNING_GAME.audio[audioId];
    if (!path) {
      console.warn('Audio clip is not registered:', audioId);
      return Promise.resolve({ played: false, missing: true });
    }
    stop();
    return playFile(audioId, path, playbackRequestId, onStart);
  }

  // Optional clips can be added later without producing a 404 on every build
  // that does not include them yet. A newer playback request cancels this
  // pending check before it is allowed to start the optional clip.
  async function playOptional(audioId, onStart) {
    const path = window.LEARNING_GAME.optionalAudio && window.LEARNING_GAME.optionalAudio[audioId];
    if (!path) return { played: false, missing: true, optional: true };

    stop();
    const requestId = playbackRequestId;
    try {
      const response = await fetch(path, { method: 'HEAD', cache: 'no-store' });
      if (requestId !== playbackRequestId) {
        return { played: false, stopped: true, optional: true };
      }
      if (!response.ok) return { played: false, missing: true, optional: true };
    } catch (_) {
      if (requestId !== playbackRequestId) {
        return { played: false, stopped: true, optional: true };
      }
      return { played: false, missing: true, optional: true };
    }

    if (requestId !== playbackRequestId) {
      return { played: false, stopped: true, optional: true };
    }
    return playFile(audioId, path, requestId, onStart);
  }

  function preload(ids) {
    ids.forEach((id) => {
      const path = window.LEARNING_GAME.audio[id];
      if (!path) return;
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.load();
    });
  }

  window.LocalAudio = { play, playOptional, stop, preload };
})();
