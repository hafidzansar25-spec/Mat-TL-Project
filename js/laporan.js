(function () {
  const user = requireAuth();
  if (!user) return;
  renderNavbar('laporan.html');

  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthInput = document.getElementById('monthFilter');
  monthInput.value = defaultMonth;

  function render() {
    const ym = monthInput.value || defaultMonth;
    const all = getEntries(user.id);
    const filtered = all
      .filter(e => e.date.startsWith(ym))
      .sort((a, b) => a.date.localeCompare(b.date));

    const total = filtered.reduce((s, e) => s + e.weightKg, 0);
    document.getElementById('summary').textContent =
      `Total: ${total.toFixed(2)} kg · ${filtered.length} entri`;

    const tbody = document.getElementById('tableBody');
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="5">Belum ada data bulan ini.</td></tr>`;
      return;
    }
    tbody.innerHTML = filtered.map(e => `
      <tr>
        <td>${e.date}</td>
        <td>${CATEGORIES[e.category]}</td>
        <td class="num">${e.weightKg} kg</td>
        <td style="color:var(--text-muted);">${e.note || '-'}</td>
        <td style="text-align:right; white-space:nowrap;">
          <button class="btn-edit-text" data-edit="${e.id}">Edit</button>
          <button class="btn-danger-text" data-id="${e.id}">Hapus</button>
        </td>
      </tr>
    `).join('');
  }

  // Handler klik: edit / hapus
  document.getElementById('tableBody').addEventListener('click', (e) => {
    const editBtn = e.target.closest('button[data-edit]');
    if (editBtn) {
      window.location.href = `input.html?edit=${editBtn.dataset.edit}`;
      return;
    }

    const delBtn = e.target.closest('button[data-id]');
    if (!delBtn) return;

    if (!confirm('Apakah kamu yakin ingin menghapus catatan ini?')) return;
    deleteEntry(delBtn.dataset.id);
    render();
  });

  monthInput.addEventListener('change', render);

  document.getElementById('btnExport').addEventListener('click', () => {
    const ym = monthInput.value || defaultMonth;
    const all = getEntries(user.id).filter(e => e.date.startsWith(ym));
    if (all.length === 0) { alert('Tidak ada data untuk diexport.'); return; }

    const rows = [
      ['Tanggal', 'Kategori', 'Berat (kg)', 'Catatan'],
      ...all.map(e => [e.date, CATEGORIES[e.category], e.weightKg, e.note || '']),
    ];
    const csv = rows
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-sampah-${ym}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });

  render();
})();
