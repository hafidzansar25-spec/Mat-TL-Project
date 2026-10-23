/* ============================================================
   STORAGE: seluruh akses localStorage terpusat di sini.
   Nanti kalau upgrade ke backend, cukup ubah file ini.
   ============================================================ */

const KEYS = {
  users: 'sw_users',
  entries: 'sw_entries',
  session: 'sw_session',
};

const CATEGORIES = {
  organik: 'Organik',
  plastik: 'Plastik',
  kertas: 'Kertas',
  logam: 'Logam',
  kaca: 'Kaca',
  b3: 'B3 (Bahan Berbahaya)',
  lainnya: 'Lainnya',
};

const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni',
                   'Juli','Agustus','September','Oktober','November','Desember'];
const MONTHS_ID_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun',
                         'Jul','Agu','Sep','Okt','Nov','Des'];
const DAYS_ID_SHORT = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

/* ---------- USERS ---------- */
function getUsers() {
  return JSON.parse(localStorage.getItem(KEYS.users) || '[]');
}
function saveUsers(users) {
  localStorage.setItem(KEYS.users, JSON.stringify(users));
}
function createUser(data) {
  const users = getUsers();
  if (users.some(u => u.email === data.email)) {
    throw new Error('Email sudah terdaftar');
  }
  const user = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

/* ---------- SESSION ---------- */
function setSession(userId) { localStorage.setItem(KEYS.session, userId); }
function clearSession()     { localStorage.removeItem(KEYS.session); }
function getSessionUserId() { return localStorage.getItem(KEYS.session); }
function getCurrentUser() {
  const id = getSessionUserId();
  if (!id) return null;
  return getUsers().find(u => u.id === id) || null;
}

/* ---------- ENTRIES ---------- */
function getAllEntries() {
  return JSON.parse(localStorage.getItem(KEYS.entries) || '[]');
}
function getEntries(userId) {
  return getAllEntries().filter(e => e.userId === userId);
}
function saveEntry(entry) {
  const all = getAllEntries();
  const idx = all.findIndex(e => e.id === entry.id);
  if (idx >= 0) all[idx] = entry;
  else all.push(entry);
  localStorage.setItem(KEYS.entries, JSON.stringify(all));
}
function addEntry(userId, date, category, weightKg, note) {
  const entry = {
    id: crypto.randomUUID(),
    userId, date, category,
    weightKg: Number(weightKg),
    note: note || '',
    createdAt: new Date().toISOString(),
  };
  saveEntry(entry);
  return entry;
}
function deleteEntry(id) {
  const all = getAllEntries().filter(e => e.id !== id);
  localStorage.setItem(KEYS.entries, JSON.stringify(all));
}

/* ---------- DATE UTILS ---------- */
function formatDateISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function parseDateISO(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function formatDateID(input, short = false) {
  const d = typeof input === 'string' ? parseDateISO(input) : input;
  const months = short ? MONTHS_ID_SHORT : MONTHS_ID;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
function getMonthName(date, short = false) {
  return (short ? MONTHS_ID_SHORT : MONTHS_ID)[date.getMonth()];
}
function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
