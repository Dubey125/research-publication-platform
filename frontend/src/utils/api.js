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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ijaif_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
        localStorage.setItem('ijaif_admin_token', data.token);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
      }
      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('ijaif_admin');
      localStorage.removeItem('ijaif_admin_token');
      return Promise.reject(refreshError);
    }
  }
);

export default api;
