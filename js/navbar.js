function renderNavbar(activePage) {
  const user = getCurrentUser();
  if (!user) return;

  const links = [
    { href: 'dashboard.html', label: 'Dashboard' },
    { href: 'input.html',     label: 'Catat Sampah' },
    { href: 'kalender.html',  label: 'Kalender' },
    { href: 'laporan.html',   label: 'Laporan' },
  ];

  const nav = document.getElementById('navbar');
  if (!nav) return;

  nav.innerHTML = `
    <div class="nav-inner">
      <a href="dashboard.html" class="brand">🗑️ Sekolah Sampah</a>
      <div class="nav-links">
        ${links.map(l => `
          <a href="${l.href}" class="nav-link ${l.href === activePage ? 'active' : ''}">${l.label}</a>
        `).join('')}
      </div>
      <div class="nav-user">
        <span class="user-info">${user.name} · <span class="role">${user.role}</span></span>
        <button onclick="logoutUser()" class="btn-logout">Keluar</button>
      </div>
    </div>
  `;
}
