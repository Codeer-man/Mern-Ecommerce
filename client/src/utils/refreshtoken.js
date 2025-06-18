import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true, // Essential for cookies
});

let isRefreshing = false;
let failedRequests = [];

// Request interceptor - adds access token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.groupEnd();
    const originalRequest = error.config;

    // Check if this is a 401 error and not a refresh request
    if (
      error.response?.status === 500 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequests.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refreshToken`,
          {},
          { withCredentials: true }
        );

        localStorage.setItem("accessToken", data.accessToken);

        // Update default headers
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;

        // Retry all queued requests
        failedRequests.forEach((prom) => prom.resolve(data.accessToken));
        failedRequests = [];

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        // Clear auth data and redirect
        localStorage.removeItem("accessToken");
        window.location.href = "/login";

        // Reject all queued requests
        failedRequests.forEach((prom) => prom.reject(refreshError));
        failedRequests = [];

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For non-401 errors or when refresh already attempted
    return Promise.reject(error);
  }
);

export default api;
