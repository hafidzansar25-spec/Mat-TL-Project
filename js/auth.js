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
