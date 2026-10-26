/**
 * Brand Machine — Toggle + state management
 */
(function () {
  const section = document.querySelector('section')?.closest ? null : null;
  const machineRoot = document.getElementById('brand-machine');
  const toggle = document.getElementById('machine-toggle');

  if (!machineRoot || !toggle) return;

  let isActive = true;

  function renderState() {
    machineRoot.classList.toggle('is-active', isActive);
    machineRoot.classList.toggle('is-idle', !isActive);
    toggle.setAttribute('aria-pressed', String(isActive));
  }

  toggle.addEventListener('click', function () {
    isActive = !isActive;
    renderState();
  });

  renderState();
})();
