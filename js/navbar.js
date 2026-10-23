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

  // Structure: brand + hamburger di bar, menu di dalam .nav-menu
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="dashboard.html" class="brand">♻️ Catatan Bank Sampah</a>
      <button class="nav-toggle" id="navToggle" aria-label="Buka menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-menu" id="navMenu">
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
    </div>
  `;

  // Overlay (di body, agar z-index di bawah navbar)
  let overlay = document.getElementById('navOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.id = 'navOverlay';
    document.body.appendChild(overlay);
  }

  const toggle = document.getElementById('navToggle');
  const inner  = nav.querySelector('.nav-inner');

  function closeMenu() {
    inner.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('visible');
  }
  function openMenu() {
    inner.classList.add('open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    overlay.classList.add('visible');
  }

  toggle.addEventListener('click', () => {
    if (inner.classList.contains('open')) closeMenu();
    else openMenu();
  });
  overlay.addEventListener('click', closeMenu);

  // Tutup saat link diklik
  nav.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Tutup saat resize ke desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

  // Tutup dengan Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}
