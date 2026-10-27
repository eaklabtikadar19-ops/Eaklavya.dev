/**
 * Stats Counter — Precision Gauge Meter Animation (0% to 99.8% SLA)
 * Automatically sweeps 0.0% -> 99.8% whenever someone enters #advantage or the meter dial
 */
(() => {
  const metricContainer = document.getElementById('metric-circle-container');
  const percentageEl = document.getElementById('metric-percentage');
  const progressRing = document.getElementById('metric-progress-ring');
  const progressDot = document.getElementById('metric-progress-dot');
  const needleLine = document.getElementById('metric-needle-line');
  const advantageSection = document.getElementById('advantage');

  if (!percentageEl) return;

  const radius = 150;
  const circumference = 2 * Math.PI * radius; // ~942.48
  const targetPercent = 99.8;
  const duration = 2100; // ms

  let animId = null;
  let hasAnimatedThisView = false;

  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }

  function runMeterAnimation() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }

    if (progressRing) {
      progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
      progressRing.style.strokeDashoffset = circumference;
    }

    if (percentageEl) percentageEl.textContent = '0.0%';
    if (progressDot) progressDot.style.opacity = '1';

    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);

      const currentPercent = targetPercent * eased;
      if (percentageEl) {
        percentageEl.textContent = currentPercent.toFixed(1) + '%';
      }

      if (progressRing) {
        const offset = circumference * (1 - (currentPercent / 100));
        progressRing.style.strokeDashoffset = offset;
      }

      const angle = (currentPercent / 100) * Math.PI * 2;
      const x = 180 + radius * Math.cos(angle);
      const y = 180 + radius * Math.sin(angle);

      if (progressDot) {
        progressDot.setAttribute('cx', x.toFixed(2));
        progressDot.setAttribute('cy', y.toFixed(2));
      }

      if (needleLine) {
        const needleRadius = 142;
        const nx = 180 + needleRadius * Math.cos(angle);
        const ny = 180 + needleRadius * Math.sin(angle);
        needleLine.setAttribute('x2', nx.toFixed(2));
        needleLine.setAttribute('y2', ny.toFixed(2));
      }

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        if (percentageEl) percentageEl.textContent = targetPercent.toFixed(1) + '%';
        if (progressRing) {
          progressRing.style.strokeDashoffset = circumference * (1 - (targetPercent / 100));
        }
        animId = null;
      }
    }

    animId = requestAnimationFrame(tick);
  }

  // IntersectionObserver: sweeps 0.0% -> 99.8% whenever someone enters the meter dial section
  const observerTarget = metricContainer || advantageSection;
  if (observerTarget) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!hasAnimatedThisView) {
            hasAnimatedThisView = true;
            runMeterAnimation();
          }
        } else {
          // Reset so re-entering the section triggers the sweep again!
          hasAnimatedThisView = false;
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '40px 0px 40px 0px'
    });

    observer.observe(observerTarget);

    // Initial check on page load in case already in view
    setTimeout(() => {
      const rect = observerTarget.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        hasAnimatedThisView = true;
        runMeterAnimation();
      }
    }, 300);
  }

  // Scroll fallback
  let scrollThrottle = null;
  window.addEventListener('scroll', () => {
    if (scrollThrottle) return;
    scrollThrottle = setTimeout(() => {
      scrollThrottle = null;
      if (!hasAnimatedThisView && observerTarget) {
        const rect = observerTarget.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1) {
          hasAnimatedThisView = true;
          runMeterAnimation();
        }
      }
    }, 100);
  }, { passive: true });

  // Replay on clicking the meter card
  if (metricContainer) {
    metricContainer.addEventListener('click', () => {
      runMeterAnimation();
    });
  }

  // Generic fallback for any other stat counters on the page
  const genericCounters = document.querySelectorAll('.stat-counter, .counter-value');
  if (genericCounters.length > 0) {
    const genericObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target') || '100', 10);
          const start = performance.now();
          const dur = 1600;
          function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            el.textContent = Math.floor(target * easeOutQuart(p));
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          }
          requestAnimationFrame(tick);
          genericObserver.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    genericCounters.forEach(c => genericObserver.observe(c));
  }
})();
