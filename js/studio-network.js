/**
 * Studio Network — Canvas particle animation + Countup stats
 * Pauses when off-screen to save CPU/GPU
 */
(() => {
  const canvas = document.getElementById('networkCanvas');
  const zone = document.getElementById('studio-motion-zone');
  if (!canvas || !zone) return;

  const ctx = canvas.getContext('2d', { alpha: true });

  let width, height, dpr;
  let particles = [];
  let isPlaying = true;
  let isVisible = false;
  let animationFrameId = null;
  let mouse = { x: 0, y: 0, active: false };

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.originSpread = width * 0.26;
      this.originX = width / 2 + (Math.random() - 0.5) * this.originSpread;
      this.originY = height + 80 + Math.random() * 50;

      this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      this.speed = 0.45 + Math.random() * 1.8;
      this.distance = initial ? Math.random() * (height * 1.1) : Math.random() * 50;
      this.maxLength = 30 + Math.random() * 150;
      this.length = 0;
      this.alpha = 0;
      this.lineWidth = 0.5 + Math.random() * 1.4;
      this.waveOffset = Math.random() * Math.PI * 2;
      
      const labels = ["0x4F", "JSON", "SYS", "BIN", "HEX", "DAT", "TCP", "API", "LOG", "SQL", "VAR", "NET"];
      this.label = labels[Math.floor(Math.random() * labels.length)];
    }

    update(time) {
      this.distance += this.speed;
      this.length = Math.min(this.maxLength, this.distance * 0.9);

      const normalized = this.distance / (height * 1.15);
      this.alpha = Math.min(1, this.distance / 110) * Math.max(0, 1 - normalized * 0.88);

      if (this.distance > height * 1.25) {
        this.reset();
      }

      this.time = time;
    }

    draw() {
      const waveX = Math.sin(this.time * 0.0015 + this.waveOffset + this.distance * 0.01) * 18;
      const waveY = Math.cos(this.time * 0.0012 + this.waveOffset) * 6;

      const baseStartX = this.originX + Math.cos(this.angle) * this.distance + waveX * 0.15;
      const baseStartY = this.originY + Math.sin(this.angle) * this.distance + waveY;

      const baseEndX = this.originX + Math.cos(this.angle) * (this.distance + this.length) + waveX;
      const baseEndY = this.originY + Math.sin(this.angle) * (this.distance + this.length) + waveY * 0.35;

      let startX = baseStartX;
      let startY = baseStartY;
      let endX = baseEndX;
      let endY = baseEndY;

      if (mouse.active) {
        const dx = endX - mouse.x;
        const dy = endY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 180);

        if (influence > 0) {
          const pushX = (dx / (dist || 1)) * influence * 26;
          const pushY = (dy / (dist || 1)) * influence * 18;
          endX += pushX;
          endY += pushY;
          startX += pushX * 0.18;
          startY += pushY * 0.12;
        }
      }

      const depth = Math.min(1, this.distance / height);
      const hue = 228 + depth * 18;
      const saturation = 88;
      const lightness = 76 - depth * 16;

      const glowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${this.alpha * 0.95})`;
      const tailColor = `hsla(${hue}, ${saturation}%, ${lightness - 10}%, ${this.alpha * 0.06})`;

      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, tailColor);
      gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, ${this.alpha * 0.18})`);
      gradient.addColorStop(1, glowColor);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.lineWidth + depth * 0.8;
      ctx.stroke();

      // Draw glow dot at tip
      ctx.beginPath();
      ctx.arc(endX, endY, 1.4 + depth * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 96%, 66%, ${this.alpha})`;
      ctx.shadowColor = `hsla(${hue}, 96%, 66%, ${this.alpha * 0.65})`;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Draw techy code label next to the dot
      if (this.distance > 20) { // Only show label when it starts moving up
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${this.alpha * 0.85})`;
        ctx.fillText(this.label, endX + 8, endY + 3);
      }
    }
  }

  function initParticles() {
    particles = [];
    // Reduced particle count for better performance
    const count = window.innerWidth < 768 ? 80 : 160;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawBackgroundGlow() {
    const grad = ctx.createRadialGradient(width / 2, height * 0.9, 0, width / 2, height * 0.9, height * 0.7);
    grad.addColorStop(0, 'rgba(99,102,241,0.12)');
    grad.addColorStop(0.3, 'rgba(129,140,248,0.08)');
    grad.addColorStop(0.7, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  function animate(time = 0) {
    if (!isPlaying || !isVisible) { animationFrameId = null; return; }

    ctx.clearRect(0, 0, width, height);
    drawBackgroundGlow();

    particles.forEach((p) => {
      p.update(time);
      p.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  function tryResume() {
    if (isPlaying && isVisible && !animationFrameId) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  zone.addEventListener('mousemove', (e) => {
    const rect = zone.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  zone.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  window.addEventListener('resize', () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    resize();
    tryResume();
  });

  resize();

  // Visibility-based pausing
  const visObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) tryResume();
    });
  }, { threshold: 0.05 });

  visObserver.observe(zone);

  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        pauseBtn.innerHTML = '<iconify-icon icon="solar:pause-linear" width="16" height="16" style="stroke-width: 1.5;"></iconify-icon>';
        tryResume();
      } else {
        pauseBtn.innerHTML = '<iconify-icon icon="solar:play-linear" width="16" height="16" style="stroke-width: 1.5;"></iconify-icon>';
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    });
  }

  // Count up on view
  const countEls = document.querySelectorAll('.countup');
  const animateCount = (el) => {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const target = parseFloat(el.dataset.count || '0');
    const suffix = el.dataset.suffix || '';
    const hasDecimal = String(target).includes('.');
    const duration = 1600;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      el.textContent = hasDecimal
        ? value.toFixed(1) + suffix
        : Math.floor(value) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = (hasDecimal ? target.toFixed(1) : target) + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  countEls.forEach((el) => observer.observe(el));
})();
