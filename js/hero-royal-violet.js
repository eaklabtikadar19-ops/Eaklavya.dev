/**
 * Zapline — "Royal Violet" Trading CTA Hero Controller
 * 
 * Optimized & Hardened:
 * 1. Single execution guard prevents duplicate timers, canvas renders, and listener leaks.
 * 2. Instant stage scaling eliminates initial layout shift and blowout.
 * 3. Resilient video playback with auto-play recovery, cloudfront fallback, and instant user-interaction unlock.
 * 4. Lightweight procedural stars canvas with optimal performance.
 * 5. Smooth entrance animations for headline, lede, buttons, and rising dashboard.
 * 6. Hero dashboard Royal Violet area chart (HTML5 Canvas 2D).
 */

(() => {
  'use strict';

  if (window.__heroVioletInitialized) return;
  window.__heroVioletInitialized = true;

  // Respect user motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. Frame & Scaling: 1672×720 Design Stage scaled by min(vw/1672, vh/720)
     ========================================================================== */
  function initStageScaling() {
    const stage = document.getElementById('stage');
    const heroWrapper = document.getElementById('hero-stage-wrapper');
    if (!stage || !heroWrapper) return;

    let lastW = 0, lastH = 0;

    function updateStageScale() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (Math.abs(vw - lastW) < 2 && Math.abs(vh - lastH) < 2) return;
      lastW = vw;
      lastH = vh;

      // Below 900px or portrait mobile layout
      if (vw < 900 || (vw < 1024 && vh > vw)) {
        stage.style.position = 'relative';
        stage.style.left = '0';
        stage.style.top = '0';
        stage.style.transform = 'none';
        stage.style.width = '100%';
        stage.style.height = 'auto';
        heroWrapper.style.height = 'auto';
        return;
      }

      // Design frame: 1672px design width, 490px design height (compact, no empty void)
      const dw = 1672;
      const s = vw / dw;

      // Center horizontally and scale
      stage.style.position = 'absolute';
      stage.style.top = '0';
      stage.style.left = '50%';
      stage.style.width = `${dw}px`;
      stage.style.transform = `translateX(-50%) scale(${s})`;
      stage.style.transformOrigin = 'top center';

      const totalDesignHeight = 490;
      const renderedHeight = Math.round(totalDesignHeight * s);
      heroWrapper.style.height = `${renderedHeight}px`;
      stage.style.height = `${totalDesignHeight}px`;
    }

    window.addEventListener('resize', updateStageScale, { passive: true });
    window.addEventListener('orientationchange', updateStageScale, { passive: true });
    updateStageScale();
  }

  /* ==========================================================================
     2. Procedural White Stars on Canvas (Lightweight, sky background)
     ========================================================================== */
  function initStarsCanvas() {
    const starsCanvas = document.getElementById('stars-canvas');
    if (!starsCanvas) return;
    const ctx = starsCanvas.getContext('2d', { alpha: true });

    function renderStars() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      starsCanvas.width = Math.floor(w * dpr);
      starsCanvas.height = Math.floor(h * dpr);
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, w, h);

      // Controlled star count for silky 60fps performance
      const count = Math.min(180, Math.floor((w * h) / 9000));
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() < 0.85 ? (Math.random() * 0.65 + 0.3) : (Math.random() * 1.1 + 0.6);
        const a = Math.random() * 0.6 + 0.25;

        ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        if (Math.random() < 0.1) {
          ctx.fillStyle = `rgba(180, 140, 255, ${a * 0.75})`;
          ctx.beginPath();
          ctx.arc(x, y, r * 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    renderStars();
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderStars, 200);
    }, { passive: true });
  }

  /* ==========================================================================
     3. Fallback Rim Canvas (Violet rim painted from polar color table)
     ========================================================================== */
  function initRimFallbackCanvas() {
    const fallbackCanvas = document.getElementById('rim-fallback');
    if (!fallbackCanvas) return;
    const ctx = fallbackCanvas.getContext('2d');

    function drawFallbackRim() {
      const w = 1672;
      const h = 717;
      fallbackCanvas.width = w;
      fallbackCanvas.height = h;

      ctx.clearRect(0, 0, w, h);

      // Subtle atmospheric halo centered on the top arc apex
      const halo = ctx.createRadialGradient(836, 140, 10, 836, 140, 480);
      halo.addColorStop(0, 'rgba(147, 18, 255, 0.25)');
      halo.addColorStop(0.35, 'rgba(122, 28, 248, 0.10)');
      halo.addColorStop(0.7, 'rgba(80, 12, 180, 0.03)');
      halo.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(836, 140, 480, 0, Math.PI * 2);
      ctx.fill();

      // Outer wide violet plasma glow
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 45);
      ctx.quadraticCurveTo(836, 220, 1672, 45);
      ctx.strokeStyle = 'rgba(147, 18, 255, 0.45)';
      ctx.lineWidth = 14;
      ctx.shadowColor = '#d946ef';
      ctx.shadowBlur = 32;
      ctx.stroke();

      // Mid magenta/violet arc
      ctx.beginPath();
      ctx.moveTo(0, 45);
      ctx.quadraticCurveTo(836, 220, 1672, 45);
      ctx.strokeStyle = 'rgba(216, 120, 255, 0.85)';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Sharp core white-hot planetary rim line
      ctx.beginPath();
      ctx.moveTo(0, 45);
      ctx.quadraticCurveTo(836, 220, 1672, 45);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();
    }

    drawFallbackRim();
  }

  /* ==========================================================================
     4. Glowing Planet Rim Video (Rock-Solid Playback & CDN Fallback)
     ========================================================================== */
  function initPlanetVideo() {
    const video = document.getElementById('glow-video');
    const fallbackCanvas = document.getElementById('rim-fallback');
    if (!video) return;

    function showFallback() {
      if (fallbackCanvas) {
        fallbackCanvas.style.display = 'block';
        requestAnimationFrame(() => {
          fallbackCanvas.style.opacity = '1';
        });
      }
    }

    if (prefersReducedMotion) {
      video.style.display = 'none';
      showFallback();
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    let revealed = false;
    function onVideoPlaying() {
      if (revealed) return;
      revealed = true;
      video.style.opacity = '1';
      if (fallbackCanvas) {
        fallbackCanvas.style.transition = 'opacity 0.6s ease';
        fallbackCanvas.style.opacity = '0';
        setTimeout(() => {
          if (revealed && fallbackCanvas) fallbackCanvas.style.display = 'none';
        }, 650);
      }
    }

    video.addEventListener('playing', onVideoPlaying);
    video.addEventListener('canplay', onVideoPlaying);
    video.addEventListener('loadeddata', onVideoPlaying);
    video.addEventListener('timeupdate', () => {
      if (video.currentTime > 0) onVideoPlaying();
    });

    const cdnUrl = 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e859f229-8ebd-43fb-a5a0-58006ba75327.mp4';

    video.addEventListener('error', () => {
      console.warn('Video failed on primary source, attempting CDN fallback...');
      if (video.src !== cdnUrl) {
        video.src = cdnUrl;
        video.load();
        tryPlay();
      } else {
        showFallback();
      }
    });

    function tryPlay() {
      video.muted = true;
      const p = video.play();
      if (p !== undefined) {
        p.then(onVideoPlaying).catch(() => {
          showFallback();
        });
      } else {
        showFallback();
      }
    }

    tryPlay();

    // Universal unlock for strict browser autoplay permissions
    const unlockPlay = () => {
      if (video.paused) {
        video.muted = true;
        video.play().then(onVideoPlaying).catch(() => {});
      }
    };
    ['pointerdown', 'click', 'touchstart', 'scroll', 'wheel', 'keydown'].forEach(evt => {
      window.addEventListener(evt, unlockPlay, { once: true, passive: true });
    });
  }

  /* ==========================================================================
     5. One-Timeline Entrance Motion
     ========================================================================== */
  function runEntranceTimeline() {
    if (prefersReducedMotion) {
      document.querySelectorAll('#site-nav, .headline-line, #hero-lede, #hero-buttons')
        .forEach(el => el.classList.add('entered'));
      return;
    }

    const nav = document.getElementById('site-nav');
    const line1 = document.querySelector('.headline-line.line-1');
    const line2 = document.querySelector('.headline-line.line-2');
    const lede = document.getElementById('hero-lede');
    const buttons = document.getElementById('hero-buttons');

    setTimeout(() => { if (nav) nav.classList.add('entered'); }, 60);
    setTimeout(() => { if (line1) line1.classList.add('entered'); }, 180);
    setTimeout(() => { if (line2) line2.classList.add('entered'); }, 320);
    setTimeout(() => {
      if (lede) lede.classList.add('entered');
      if (buttons) buttons.classList.add('entered');
    }, 480);
  }

  /* ==========================================================================
     Safe Initializer (Single Execution)
     ========================================================================== */
  function initAll() {
    initStarsCanvas();
    initRimFallbackCanvas();
    initPlanetVideo();
    initStageScaling();
    runEntranceTimeline();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }
})();
