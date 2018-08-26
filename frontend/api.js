import decode from 'jwt-decode';

export function setToken(token) {
  window.localStorage.setItem('token', token);
}

export function getToken() {
  return window.localStorage.getItem('token');
}

export function unsetToken() {
  window.localStorage.removeItem('token');
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

export function getUser(userId) {
  const url = `${process.env.BACKEND_URL}/v1/api/users/${userId}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

export function getCatalogs(userId) {
  const url = `${process.env.BACKEND_URL}/v1/api/users/${userId}/catalogs`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

export function getCatalog(catalogId) {
  const url = `${process.env.BACKEND_URL}/v1/api/catalogs/${catalogId}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

export function queryMovies(query) {
  const url = `${process.env.BACKEND_URL}/v1/api/movies/search?q=${query}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

export function getMovie(movieId) {
  const url = `${process.env.BACKEND_URL}/v1/api/movies/${movieId}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

export function addMovieToCatalog(movieId, catalogId) {
  const url = `${process.env.BACKEND_URL}/v1/api/catalogs/${catalogId}/movies`;
  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: getToken(),
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      movieId,
    }),
  });
}

export function createCatalog(name) {
  const url = `${process.env.BACKEND_URL}/v1/api/catalogs`;
  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: getToken(),
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      name,
    }),
  });
}
