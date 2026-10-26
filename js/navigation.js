/**
 * Navigation — Mobile menu toggle
 */
(() => {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  if (!toggle || !menu || toggle.dataset.bound === 'true') return;
  toggle.dataset.bound = 'true';

  function setMenuState(isOpen) {
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    if (isOpen) {
      menu.classList.remove('max-h-0', 'opacity-0');
      menu.classList.add('max-h-[420px]', 'opacity-100');
      iconOpen.classList.add('hidden');
      iconClose.classList.remove('hidden');
    } else {
      menu.classList.add('max-h-0', 'opacity-0');
      menu.classList.remove('max-h-[420px]', 'opacity-100');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
    }
  }

  let isOpen = false;
  setMenuState(false);

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    setMenuState(isOpen);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      isOpen = false;
      setMenuState(false);
    }
  });
})();
