/**
 * Scroll Entrance Animations
 * Adds 'reveal-visible' class smoothly as elements approach the viewport.
 */
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px 80px 0px'
  });

  // Automatically apply entrance animation to sections (excluding hero stage)
  const animatedElements = document.querySelectorAll('section:not(#hero-stage-wrapper), footer');
  animatedElements.forEach((el) => {
    if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-fade')) {
      el.classList.add('reveal-up');
    }
    observer.observe(el);
  });
});
