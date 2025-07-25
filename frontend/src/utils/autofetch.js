import { logoutAndRedirect } from './logoutHelper';

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('access_token');

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    logoutAndRedirect();
    throw new Error('Session expired. Logged out.');
  }

  return res;
}
