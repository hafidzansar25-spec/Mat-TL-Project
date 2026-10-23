(function () {
  const user = requireAuth();
  if (!user) return;
  renderNavbar('input.html');

  const catSelect = document.getElementById('category');
  catSelect.innerHTML = Object.entries(CATEGORIES)
    .map(([k, v]) => `<option value="${k}">${v}</option>`)
    .join('');

  // ---------- Mode: baru vs edit ----------
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('edit');
  let editingEntry = null;

  const titleEl   = document.querySelector('h1');
  const subEl     = document.querySelector('.page-header .sub');
  const submitBtn = document.querySelector('#inputForm .btn-primary');

  if (editId) {
    const found = getEntryById(editId);
    if (found && found.userId === user.id) {
      editingEntry = found;
      document.getElementById('date').value     = found.date;
      catSelect.value                            = found.category;
      document.getElementById('weight').value   = found.weightKg;
      document.getElementById('note').value     = found.note || '';
      if (titleEl)   titleEl.textContent         = 'Edit Catatan';
      if (subEl)     subEl.textContent           = 'Perbaiki data yang salah';
      if (submitBtn) submitBtn.textContent       = 'Simpan Perubahan';
    } else {
      // ID tidak valid / bukan milik user — fallback ke mode baru
      if (titleEl) titleEl.textContent = 'Catatan tidak ditemukan';
      if (subEl)   subEl.textContent   = 'Kembali ke laporan dan pilih data yang ingin diedit';
    }
  } else {
    document.getElementById('date').value = formatDateISO(new Date());
  }

  document.getElementById('inputForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const okMsg  = document.getElementById('okMsg');
    const errMsg = document.getElementById('errMsg');
    okMsg.style.display  = 'none';
    errMsg.style.display = 'none';

    const date     = document.getElementById('date').value;
    const category = catSelect.value;
    const weight   = parseFloat(document.getElementById('weight').value);
    const note     = document.getElementById('note').value.trim();

    if (!date) return showErr('Tanggal wajib diisi.');
    if (!weight || weight <= 0) return showErr('Berat harus lebih dari 0.');

    // ---------- MODE EDIT ----------
    if (editingEntry) {
      if (!confirm('Apakah kamu yakin ingin menyimpan perubahan ini?')) return;

      editingEntry.date     = date;
      editingEntry.category = category;
      editingEntry.weightKg = weight;
      editingEntry.note     = note;
      saveEntry(editingEntry);

      okMsg.textContent = '✅ Perubahan disimpan! Mengalihkan...';
      okMsg.style.display = 'block';
      setTimeout(() => { window.location.href = 'laporan.html'; }, 800);
      return;
    }

    // ---------- MODE BARU: cek duplikat (tanggal + kategori sama) ----------
    const existing = findEntry(user.id, date, category);
    if (existing) {
      const msg =
        `Catatan ${CATEGORIES[category]} tanggal ${formatDateID(date)} ` +
        `sudah ada (${existing.weightKg} kg).\n\n` +
        `Apakah kamu yakin ingin menggantinya?`;
      if (!confirm(msg)) return;

      existing.weightKg = weight;
      existing.note     = note;
      saveEntry(existing);

      okMsg.textContent = '✅ Catatan lama diganti dengan data baru!';
      okMsg.style.display = 'block';
      setTimeout(() => { okMsg.style.display = 'none'; }, 2500);
      return;
    }

    // ---------- MODE BARU: konfirmasi utama ----------
    if (!confirm('Apakah kamu yakin?')) return;

    addEntry(user.id, date, category, weight, note);
    document.getElementById('weight').value = '';
    document.getElementById('note').value   = '';
    okMsg.textContent = '✅ Berhasil disimpan!';
    okMsg.style.display = 'block';
    setTimeout(() => { okMsg.style.display = 'none'; }, 2500);
  });

  function showErr(msg) {
    const errMsg = document.getElementById('errMsg');
    errMsg.textContent   = msg;
    errMsg.style.display = 'block';
  }
})();
