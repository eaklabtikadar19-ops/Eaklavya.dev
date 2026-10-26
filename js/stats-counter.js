/**
 * Stats Counter — Counter animations + progress ring (Global Scale section)
 */
(function () {
  const section = document.querySelector('section.overflow-hidden.bg-gradient-to-br');
  if (!section) return;

  const counters = section.querySelectorAll('.stat-counter, .counter-value');
  const progressRing = section.querySelector('#progress-ring');
  const progressDot = section.querySelector('#progress-dot');

  let hasAnimated = false;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el, duration) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);

      el.textContent = Math.floor(target * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }

  function animateProgress(targetPercent, duration) {
    if (!progressRing) return;

    const radius = 92;
    const circumference = 2 * Math.PI * radius;
    const startTime = performance.now();

    progressRing.style.strokeDasharray = circumference;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);

      const currentPercent = targetPercent * eased;
      const offset = circumference * (1 - currentPercent / 100);

      progressRing.style.strokeDashoffset = offset;

      if (progressDot) {
        const angle = (currentPercent / 100) * Math.PI * 2 - Math.PI / 2;
        const x = 120 + radius * Math.cos(angle);
        const y = 120 + radius * Math.sin(angle);
        progressDot.setAttribute('cx', x.toFixed(2));
        progressDot.setAttribute('cy', y.toFixed(2));
        progressDot.style.opacity = '1';
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;

        counters.forEach((el, index) => {
          animateCounter(el, 1800 + index * 120);
        });

        animateProgress(84, 2200);

        observer.unobserve(section);
      }
    });
  }, { threshold: 0.28 });

  observer.observe(section);
})();
