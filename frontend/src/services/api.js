import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Helper to trigger loader
const triggerLoading = (state) => {
  window.dispatchEvent(new CustomEvent('loading-state', { detail: state }));
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    triggerLoading(true); // Turn on loader
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    triggerLoading(false);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    triggerLoading(false); // Turn off loader
    return response;
  },
  (error) => {
    triggerLoading(false); // Turn off loader on error
    return Promise.reject(error);
  }
);

export default api;