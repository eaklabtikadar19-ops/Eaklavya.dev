/**
 * Hero Chart — Starlight revenue chart (Chart.js)
 */
(function () {
  const checkChart = setInterval(() => {
    if (typeof Chart !== 'undefined') {
      clearInterval(checkChart);
      renderChart();
    } else if (!document.getElementById('chartjs-lib')) {
      const script = document.createElement('script');
      script.id = 'chartjs-lib';
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      document.head.appendChild(script);
    }
  }, 50);

  function renderChart() {
    const canvas = document.getElementById('chart-starlight-aura-emmxvdx2om6gbbtg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 64);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{
          data: [4200, 5800, 5100, 8400, 7900, 10500, 12450],
          borderColor: '#6366f1',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: true,
          backgroundColor: gradient
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        },
        layout: {
          padding: { top: 5, bottom: 0, left: 0, right: 0 }
        },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false, grid: { display: false } },
          y: { display: false, min: 3000, grid: { display: false } }
        },
        interaction: { intersect: false, mode: 'index' }
      }
    });
  }
})();
