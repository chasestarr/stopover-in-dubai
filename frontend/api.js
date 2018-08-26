import decode from 'jwt-decode';

export function setToken(token) {
  window.localStorage.setItem('token', token);
}

export function getToken() {
  return window.localStorage.getItem('token');
}

export function getUserIdFromToken() {
  const token = getToken();
  if (!token) {
    return '';
  }
  const decoded = decode(token);
  return decoded.userID;
}

export function createUser({ name, email, password }) {
  const url = `${process.env.BACKEND_URL}/v1/api/users`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export function loginUser({ email, password }) {
  const url = `${process.env.BACKEND_URL}/v1/api/users/login`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function getUser(id) {
  const url = `${process.env.BACKEND_URL}/v1/api/users/${id}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
