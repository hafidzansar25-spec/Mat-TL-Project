(function () {
  const user = requireAuth();
  if (!user) return;
  renderNavbar('input.html');

  // Isi dropdown kategori
  const catSelect = document.getElementById('category');
  catSelect.innerHTML = Object.entries(CATEGORIES)
    .map(([k, v]) => `<option value="${k}">${v}</option>`)
    .join('');

  // Default tanggal hari ini
  document.getElementById('date').value = formatDateISO(new Date());

  document.getElementById('inputForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const okMsg  = document.getElementById('okMsg');
    const errMsg = document.getElementById('errMsg');
    okMsg.style.display = 'none';
    errMsg.style.display = 'none';

    const date     = document.getElementById('date').value;
    const category = catSelect.value;
    const weight   = parseFloat(document.getElementById('weight').value);
    const note     = document.getElementById('note').value.trim();

    if (!date) return showErr('Tanggal wajib diisi.');
    if (!weight || weight <= 0) return showErr('Berat harus lebih dari 0.');

    addEntry(user.id, date, category, weight, note);

    document.getElementById('weight').value = '';
    document.getElementById('note').value = '';
    okMsg.textContent = '✅ Berhasil disimpan!';
    okMsg.style.display = 'block';
    setTimeout(() => okMsg.style.display = 'none', 2500);

    function showErr(msg) {
      errMsg.textContent = msg;
      errMsg.style.display = 'block';
    }
  });
})();
