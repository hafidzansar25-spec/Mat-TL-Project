/* Guard + login/logout helpers */

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

function loginUser(email, password) {
  const user = getUsers().find(u => u.email === email && u.password === password);
  if (!user) return null;
  setSession(user.id);
  return user;
}

function logoutUser() {
  clearSession();
  window.location.href = 'index.html';
}

/* ---------- Toggle lihat sandi ---------- */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.pw-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const input = btn.parentElement.querySelector('input');
      if (!input) return;
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      btn.classList.toggle('visible', reveal);
      btn.setAttribute('aria-label', reveal ? 'Sembunyikan sandi' : 'Tampilkan sandi');
      // Cursor tetap di akhir teks supaya user bisa lanjut ketik
      const end = input.value.length;
      input.setSelectionRange(end, end);
      input.focus();
    });
  });
});
