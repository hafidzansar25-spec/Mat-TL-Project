(function () {
  const user = requireAuth();
  if (!user) return;
  renderNavbar('dashboard.html');

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const daysTotal = daysInMonth(now);

  document.getElementById('pageTitle').textContent = 'Dashboard';
  document.getElementById('pageSub').textContent = `${getMonthName(now)} ${y}`;

  const entries = getEntries(user.id);
  const monthEntries = entries.filter(e => {
    const d = parseDateISO(e.date);
    return d.getFullYear() === y && d.getMonth() === m;
  });

  const totalKg = monthEntries.reduce((s, e) => s + e.weightKg, 0);
  const avgKg = totalKg / daysTotal;
  const daysFilled = new Set(monthEntries.map(e => e.date)).size;

  document.getElementById('statTotal').textContent   = `${totalKg.toFixed(1)} kg`;
  document.getElementById('statAvg').textContent     = `${avgKg.toFixed(2)} kg`;
  document.getElementById('statDays').textContent    = `${daysFilled}/${daysTotal}`;
  document.getElementById('statEntries').textContent = `${monthEntries.length}`;

  // Data grafik per hari
  const labels = [];
  const data = [];
  for (let day = 1; day <= daysTotal; day++) {
    const key = formatDateISO(new Date(y, m, day));
    const sum = monthEntries
      .filter(e => e.date === key)
      .reduce((s, e) => s + e.weightKg, 0);
    labels.push(String(day));
    data.push(Number(sum.toFixed(2)));
  }

  new Chart(document.getElementById('chart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Berat (kg)',
        data,
        backgroundColor: '#10b981',
        borderRadius: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'kg' } },
        x: { title: { display: true, text: 'Tanggal' } },
      },
    },
  });
})();
