import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

type RequestConfig = AxiosRequestConfig & { _retry?: boolean; headers?: Record<string, string> };

let accessToken: string | null = localStorage.getItem('accessToken');
let refreshToken: string | null = localStorage.getItem('refreshToken');
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

client.interceptors.request.use((config: RequestConfig) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfig;

    // Handle validation errors (400) with user-friendly messages
    if (error.response?.status === 400) {
      const data = error.response.data as Record<string, unknown> | undefined;
      if (data && typeof data === 'object') {
        // ASP.NET Core ValidationProblemDetails format
        const errors = data.errors as Record<string, string[]> | undefined;
        if (errors) {
          const messages = Object.values(errors).flat();
          return Promise.reject(new Error(messages.join('\n')));
        }
        // Generic error with title/detail
        const detail = data.detail as string | undefined;
        if (detail) return Promise.reject(new Error(detail));
        const title = data.title as string | undefined;
        if (title) return Promise.reject(new Error(title));
      }
      return Promise.reject(new Error('Invalid request. Please check your input.'));
    }

    // Handle other known error types
    if (error.response?.status === 401) {
      return Promise.reject(new Error('Authentication required. Please log in.'));
    }

    if (error.response?.status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action.'));
    }

    if (error.response?.status === 404) {
      return Promise.reject(new Error('The requested resource was not found.'));
    }

    if (error.response?.status === 409) {
      return Promise.reject(new Error('A conflict occurred. This resource may already exist.'));
    }

    if (error.response?.status === 429) {
      return Promise.reject(new Error('Too many requests. Please try again later.'));
    }

    if (error.response?.status === 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return client(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        const { accessToken: newAccess, refreshToken: newRefresh } = res.data;

        accessToken = newAccess;
        refreshToken = newRefresh;
        localStorage.setItem('accessToken', newAccess);
        localStorage.setItem('refreshToken', newRefresh);

        processQueue(null, newAccess);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        accessToken = null;
        refreshToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function getAccessToken() {
  return accessToken;
}

export default client;
