(function () {
  const user = requireAuth();
  if (!user) return;
  renderNavbar('kalender.html');

  const entries = getEntries(user.id);
  const byDate = entries.reduce((acc, e) => {
    (acc[e.date] ||= []).push(e);
    return acc;
  }, {});

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const daysTotal = daysInMonth(now);
  const padStart = new Date(y, m, 1).getDay(); // 0 = Minggu

  document.getElementById('pageSub').textContent = `${getMonthName(now)} ${y}`;

  // Header nama hari
  document.getElementById('calHeader').innerHTML = DAYS_ID_SHORT
    .map(d => `<div>${d}</div>`).join('');

  const grid = document.getElementById('calGrid');
  let html = '';

  // Sel kosong sebelum tanggal 1
  for (let i = 0; i < padStart; i++) {
    html += `<div class="cal-spacer"></div>`;
  }

  // Sel tanggal
  for (let day = 1; day <= daysTotal; day++) {
    const key = formatDateISO(new Date(y, m, day));
    const dayEntries = byDate[key] || [];
    const total = dayEntries.reduce((s, e) => s + e.weightKg, 0);
    const filled = dayEntries.length > 0;
    html += `
      <button class="cal-cell ${filled ? 'filled' : ''}" data-date="${key}">
        <div class="num">${day}</div>
        ${filled ? `<div class="kg">${total.toFixed(1)}kg</div>` : ''}
      </button>
    `;
  }
  grid.innerHTML = html;

  // Handle klik tanggal
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.cal-cell');
    if (!btn) return;
    const date = btn.dataset.date;

    // Toggle selected
    document.querySelectorAll('.cal-cell.selected')
      .forEach(el => el.classList.remove('selected'));

    const detailBox = document.getElementById('detailBox');
    if (btn.classList.contains('selected') && date === window.__selectedDate) {
      detailBox.style.display = 'none';
      window.__selectedDate = null;
      return;
    }
    btn.classList.add('selected');
    window.__selectedDate = date;

    document.getElementById('detailTitle').textContent =
      `Detail ${formatDateID(date)}`;

    const list = document.getElementById('detailList');
    const items = byDate[date] || [];
    if (items.length === 0) {
      list.innerHTML = `<li style="color:#9ca3af;">Belum ada catatan.</li>`;
    } else {
      list.innerHTML = items.map(e => `
        <li>
          <span>${CATEGORIES[e.category]}${e.note ? ' · ' + e.note : ''}</span>
          <span class="w">${e.weightKg} kg</span>
        </li>
      `).join('');
    }
    detailBox.style.display = 'block';
  });
})();
