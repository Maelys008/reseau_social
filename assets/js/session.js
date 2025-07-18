// assets/js/session.js

export function saveUserSession(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
}

export function getUserSession() {
  const userData = sessionStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}

export function clearUserSession() {
  sessionStorage.removeItem('user');
}

export function isLoggedIn() {
  return !!getUserSession();
}

export function getToken() {
  const user = getUserSession();
  return user ? user.token : null;
}

export function getUserId() {
  const user = getUserSession();
  return user ? user.id : null;
}

export function getUserRole() {
  const user = getUserSession();
  return user ? user.role : 'user';
}
