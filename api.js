export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export async function api(path, options = {}) {
  const token = localStorage.getItem('week4-token');
  const headers = { ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.message || 'Request failed.');
  return data;
}
