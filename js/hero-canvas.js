/**
 * Hero Canvas — Background aura animation
 * Pauses when off-screen to save CPU/GPU
 */
(function () {
  const canvas = document.getElementById('canvas-aura');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, time = 0;
  let isVisible = false;
  let rafId = null;

  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  function animate() {
    if (!isVisible) { rafId = null; return; }

    time += 0.002;
    ctx.clearRect(0, 0, width, height);

    const numFolds = 12;
    for (let i = 0; i < numFolds; i++) {
      const normalizedX = i / numFolds;
      const xPos = (normalizedX * width) + Math.sin(time * 2 + i) * (width * 0.08);
      const foldWidth = (width / numFolds) * 3.5;
      const waveIntensity = (Math.sin(time * 2 + i * 0.5) + 1) * 0.5;

      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, `rgba(139, 92, 246, 0)`);
      grad.addColorStop(0.5, `rgba(91, 88, 246, ${waveIntensity * 0.08})`);
      grad.addColorStop(1, `rgba(6, 182, 212, ${waveIntensity * 0.06})`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(xPos - foldWidth, 0);
      ctx.bezierCurveTo(xPos, height * 0.3, xPos - foldWidth, height * 0.7, xPos + foldWidth, height);
      ctx.lineTo(xPos + foldWidth * 2, height);
      ctx.bezierCurveTo(xPos + foldWidth, height * 0.7, xPos + foldWidth * 2, height * 0.3, xPos + foldWidth, 0);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    rafId = requestAnimationFrame(animate);
  }

  // Only animate when the hero is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) {
        rafId = requestAnimationFrame(animate);
      }
    });
  }, { threshold: 0.05 });

  observer.observe(canvas.parentElement);
})();
