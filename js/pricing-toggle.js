/**
 * Pricing Toggle — Monthly / One-Time purchase switch (Royal Violet Liquid Dark Theme)
 */
(() => {
  const toggleContainer = document.getElementById('toggle-container');
  const toggleThumb = document.getElementById('toggle-thumb');
  const toggleIcon = document.getElementById('toggle-icon');
  const toggleText = document.getElementById('toggle-text');
  const labelMonthly = document.getElementById('label-monthly');
  const labelYearly = document.getElementById('label-yearly');
  const priceElements = document.querySelectorAll('.price-val');
  const pricePeriods = document.querySelectorAll('.price-period');
  const altPriceElements = document.querySelectorAll('.alt-price-val');

  if (!toggleContainer || !toggleThumb) return;

  // false = Monthly (left), true = One-Time (right)
  let isOneTime = false;

  function updateToggleUI() {
    toggleContainer.setAttribute('aria-checked', isOneTime ? 'true' : 'false');

    const containerWidth = toggleContainer.offsetWidth || 270;
    const thumbWidth = toggleThumb.offsetWidth || 130;
    const padding = 6;
    const rightLeft = containerWidth - thumbWidth - padding;

    if (isOneTime) {
      // Move to right side (One-Time)
      toggleThumb.style.transform = `translateX(${rightLeft - padding}px)`;
      if (toggleText) toggleText.innerText = 'One-Time';
      if (toggleIcon) {
        toggleIcon.setAttribute('icon', 'solar:wallet-money-linear');
      }

      if (labelMonthly) {
        labelMonthly.className = 'text-[15px] font-medium transition-colors duration-300 text-[#8b8988]';
      }
      if (labelYearly) {
        labelYearly.className = 'text-[15px] font-semibold transition-colors duration-300 text-white';
      }

      toggleContainer.style.borderColor = 'rgba(160, 32, 255, 0.5)';
      toggleContainer.style.boxShadow = '0 0 25px rgba(160, 32, 255, 0.25), inset 0 2px 4px rgba(0,0,0,0.5)';
      toggleThumb.style.background = 'linear-gradient(135deg, #a020ff 0%, #7a1cf8 100%)';
      toggleThumb.style.color = '#ffffff';
    } else {
      // Move to left side (Monthly)
      toggleThumb.style.transform = 'translateX(0px)';
      if (toggleText) toggleText.innerText = 'Monthly';
      if (toggleIcon) {
        toggleIcon.setAttribute('icon', 'solar:calendar-linear');
      }

      if (labelMonthly) {
        labelMonthly.className = 'text-[15px] font-semibold transition-colors duration-300 text-white';
      }
      if (labelYearly) {
        labelYearly.className = 'text-[15px] font-medium transition-colors duration-300 text-[#8b8988]';
      }

      toggleContainer.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      toggleContainer.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)';
      toggleThumb.style.background = 'linear-gradient(135deg, #a020ff 0%, #7a1cf8 100%)';
      toggleThumb.style.color = '#ffffff';
    }

    priceElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(4px)';
      el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

      setTimeout(() => {
        el.innerText = isOneTime ? el.dataset.onetime : el.dataset.monthly;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 180);
    });

    pricePeriods.forEach(el => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.2s ease';

      setTimeout(() => {
        el.innerText = isOneTime ? 'one-time' : '/month';
        el.style.opacity = '1';
      }, 180);
    });

    altPriceElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.2s ease';

      setTimeout(() => {
        el.innerText = isOneTime ? el.dataset.onetime : el.dataset.monthly;
        el.style.opacity = '1';
      }, 180);
    });
  }

  toggleContainer.addEventListener('click', () => {
    isOneTime = !isOneTime;
    updateToggleUI();
  });

  toggleContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      isOneTime = !isOneTime;
      updateToggleUI();
    }
  });

  window.addEventListener('resize', updateToggleUI);
  updateToggleUI();
})();