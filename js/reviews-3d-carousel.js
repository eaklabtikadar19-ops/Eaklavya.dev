/**
 * eaklavya.dev — Reviews Horizontal 3D Bend Carousel
 * Dynamically curves cards in 3D perspective at left and right boundaries
 * while maintaining a buttery-smooth infinite marquee stream.
 */
(() => {
  const stage = document.querySelector('.reviews-3d-stage');
  if (!stage) return;

  const cards = stage.querySelectorAll('.review-3d-card');
  if (cards.length === 0) return;

  let isHovered = false;
  stage.addEventListener('mouseenter', () => { isHovered = true; });
  stage.addEventListener('mouseleave', () => { isHovered = false; });

  // Update 3D card tilt & curvature based on horizontal distance from stage center
  function update3DBend() {
    const stageRect = stage.getBoundingClientRect();
    const stageWidth = stageRect.width;
    const stageCenter = stageRect.left + stageWidth / 2;
    const halfWidth = stageWidth / 2;

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distanceFromCenter = cardCenter - stageCenter;
      const normalized = distanceFromCenter / halfWidth; // -1 on left, 0 center, +1 on right

      let rotateY = 0;
      let translateZ = 0;
      let scale = 1;

      if (normalized < -0.12) {
        // Left side bend — curves backward into 3D space
        const factor = Math.min(Math.abs(normalized), 1.25);
        rotateY = (factor - 0.12) * 22;
        translateZ = -Math.pow(factor, 1.6) * 55;
        scale = Math.max(0.9, 1 - factor * 0.08);
      } else if (normalized > 0.12) {
        // Right side bend — curves backward into 3D space
        const factor = Math.min(normalized, 1.25);
        rotateY = -(factor - 0.12) * 22;
        translateZ = -Math.pow(factor, 1.6) * 55;
        scale = Math.max(0.9, 1 - factor * 0.08);
      } else {
        // Center card — faces straight forward with slight elevation
        rotateY = 0;
        translateZ = 8;
        scale = 1;
      }

      card.style.transform = `perspective(1000px) rotateY(${rotateY.toFixed(1)}deg) translateZ(${translateZ.toFixed(1)}px) scale(${scale.toFixed(3)})`;
    });

    requestAnimationFrame(update3DBend);
  }

  // Start the 3D bend rendering loop
  requestAnimationFrame(update3DBend);
})();
