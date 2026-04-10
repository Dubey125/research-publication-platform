import axios from 'axios';

const rawBaseURL = (import.meta.env.VITE_API_URL || '').trim();

const resolvedBaseURL = (() => {
  if (!rawBaseURL) {
    return 'http://localhost:5000/api';
  }

  // Keep relative dev proxy values as-is, but normalize absolute origins to include /api.
  if (!/^https?:\/\//i.test(rawBaseURL)) {
    return rawBaseURL;
  }

  const normalized = rawBaseURL.replace(/\/+$/, '');
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
})();

const api = axios.create({
  baseURL: resolvedBaseURL,
  withCredentials: true
});

let accessToken = null;
let csrfToken = localStorage.getItem('ijtse_csrf_token');

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

export const setCsrfToken = (token) => {
  csrfToken = token || null;
  if (csrfToken) {
    localStorage.setItem('ijtse_csrf_token', csrfToken);
  } else {
    localStorage.removeItem('ijtse_csrf_token');
  }
};

export const clearCsrfToken = () => {
  csrfToken = null;
  localStorage.removeItem('ijtse_csrf_token');
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  const method = (config.method || 'get').toLowerCase();
  const isWriteMethod = ['post', 'put', 'patch', 'delete'].includes(method);
  if (csrfToken && isWriteMethod) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;
    const requestUrl = originalRequest?.url || '';

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/logout')
    ) {
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      const { data } = await api.post('/auth/refresh');
      if (data?.token) {
        setAccessToken(data.token);
        setCsrfToken(data.csrfToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        if (data?.csrfToken) {
          originalRequest.headers['X-CSRF-Token'] = data.csrfToken;
        }
      }
      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      clearCsrfToken();
      localStorage.removeItem('ijtse_admin');
      return Promise.reject(refreshError);
    }
  }
);

export default api;
