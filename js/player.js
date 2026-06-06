/* player.js — Mio Calloway music player */
(function () {
  'use strict';

  const audio = new Audio();
  let currentTrackEl = null;
  let isPlaying = false;

  const bar          = document.getElementById('player-bar');
  const barName      = document.getElementById('player-track-name');
  const barIdle      = document.getElementById('player-idle');
  const barPlayBtn   = document.getElementById('player-play-btn');
  const barProgress  = document.getElementById('player-progress');
  const barTime      = document.getElementById('player-time');
  const barVolume    = document.getElementById('player-volume');
  const barMuteBtn   = document.getElementById('player-mute-btn');

  const SVG_PLAY  = '<svg viewBox="0 0 10 12" fill="currentColor"><polygon points="0,0 10,6 0,12"/></svg>';
  const SVG_PAUSE = '<svg viewBox="0 0 10 12" fill="currentColor"><rect x="0" y="0" width="3.5" height="12"/><rect x="6.5" y="0" width="3.5" height="12"/></svg>';

  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function setProgressStyle(pct) {
    barProgress.style.setProperty('--pct', pct.toFixed(1) + '%');
  }

  function setPlayState(playing) {
    isPlaying = playing;
    barPlayBtn.innerHTML = playing ? SVG_PAUSE : SVG_PLAY;
    barPlayBtn.setAttribute('aria-label', playing ? '一時停止' : '再生');
  }

  function highlightTrack(el) {
    document.querySelectorAll('.track-item.playing').forEach(function (t) {
      t.classList.remove('playing');
      var btn = t.querySelector('.play-btn');
      if (btn) btn.innerHTML = SVG_PLAY;
    });
    if (el) {
      el.classList.add('playing');
      var btn = el.querySelector('.play-btn');
      if (btn) btn.innerHTML = SVG_PAUSE;
    }
    currentTrackEl = el;
  }

  function loadAndPlay(trackEl) {
    var src    = trackEl.dataset.src    || '';
    var title  = trackEl.dataset.title  || '';
    var isSideB = trackEl.dataset.sideb === 'true';

    audio.src = src;
    audio.load();

    /* 最初の再生でプレーヤーを表示する */
    bar.classList.add('visible');
    document.body.classList.add('player-active');

    barIdle.style.display = 'none';
    barName.style.display  = 'block';
    barName.textContent    = title;

    bar.classList.toggle('side-b-mode', isSideB);

    audio.play().then(function () {
      setPlayState(true);
      highlightTrack(trackEl);
    }).catch(function () {
      /* audio file not found — show graceful message */
      setPlayState(false);
      barName.textContent = title + ' — 音源未収録';
      highlightTrack(trackEl);
    });
  }

  /* ---- Track play buttons ---- */
  document.querySelectorAll('.play-btn').forEach(function (btn) {
    btn.innerHTML = SVG_PLAY;
    btn.setAttribute('aria-label', '再生');

    btn.addEventListener('click', function () {
      var trackEl = btn.closest('.track-item, .side-b-track-item');
      if (!trackEl) return;

      if (currentTrackEl === trackEl) {
        /* toggle same track */
        if (isPlaying) {
          audio.pause();
        } else {
          audio.play().catch(function () {});
        }
      } else {
        loadAndPlay(trackEl);
      }
    });
  });

  /* ---- Player bar controls ---- */
  barPlayBtn.addEventListener('click', function () {
    if (!audio.src || audio.src === window.location.href) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(function () {});
    }
  });

  barProgress.addEventListener('input', function () {
    if (audio.duration) {
      audio.currentTime = (barProgress.value / 100) * audio.duration;
    }
    setProgressStyle(Number(barProgress.value));
  });

  /* ---- Volume control ---- */
  var SVG_VOL = '<svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true">' +
    '<path d="M0 5v6h3l4 3V2L3 5H0z"/>' +
    '<path d="M10 4.5a4 4 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M11.5 2.5a7 7 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
    '</svg>';
  var SVG_MUTE = '<svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true">' +
    '<path d="M0 5v6h3l4 3V2L3 5H0z"/>' +
    '<path d="M10 5l4 6M14 5l-4 6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
    '</svg>';

  var lastVolume = 1;

  function setVolumeStyle(pct) {
    if (barVolume) barVolume.style.setProperty('--pct', pct + '%');
  }

  function updateMuteUI() {
    var muted = audio.muted || audio.volume === 0;
    if (barMuteBtn) {
      barMuteBtn.innerHTML = muted ? SVG_MUTE : SVG_VOL;
      barMuteBtn.classList.toggle('muted', muted);
      barMuteBtn.setAttribute('aria-label', muted ? 'ミュート解除' : 'ミュート');
    }
  }

  if (barVolume) {
    audio.volume = Number(barVolume.value) / 100;
    setVolumeStyle(Number(barVolume.value));

    barVolume.addEventListener('input', function () {
      var v = Number(barVolume.value) / 100;
      audio.volume = v;
      audio.muted = false;
      if (v > 0) lastVolume = v;
      setVolumeStyle(Number(barVolume.value));
      updateMuteUI();
    });
  }

  if (barMuteBtn) {
    barMuteBtn.addEventListener('click', function () {
      if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = lastVolume || 1;
      } else {
        lastVolume = audio.volume;
        audio.muted = true;
      }
      var shown = audio.muted ? 0 : Math.round(audio.volume * 100);
      if (barVolume) barVolume.value = shown;
      setVolumeStyle(shown);
      updateMuteUI();
    });
  }

  updateMuteUI();

  /* ---- Audio events ---- */
  audio.addEventListener('play', function () {
    setPlayState(true);
    if (currentTrackEl) {
      var btn = currentTrackEl.querySelector('.play-btn');
      if (btn) btn.innerHTML = SVG_PAUSE;
    }
  });

  audio.addEventListener('pause', function () {
    setPlayState(false);
    if (currentTrackEl) {
      var btn = currentTrackEl.querySelector('.play-btn');
      if (btn) btn.innerHTML = SVG_PLAY;
    }
  });

  audio.addEventListener('ended', function () {
    setPlayState(false);
    if (currentTrackEl) {
      currentTrackEl.classList.remove('playing');
      var btn = currentTrackEl.querySelector('.play-btn');
      if (btn) btn.innerHTML = SVG_PLAY;
      currentTrackEl = null;
    }
    barProgress.value = 0;
    setProgressStyle(0);
    barTime.textContent = '0:00 / 0:00';
  });

  audio.addEventListener('timeupdate', function () {
    if (!audio.duration) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    barProgress.value = pct;
    setProgressStyle(pct);
    barTime.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
  });

  audio.addEventListener('error', function () {
    setPlayState(false);
  });

})();
