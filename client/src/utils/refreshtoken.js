import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
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
      console.log("Access token added to request");
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
    console.log("Successful response from:", response.config.url);
    return response;
  },
  async (error) => {
    console.group("[Interceptor] Error Handling");
    console.log("Error object:", error);
    console.log("Has response?:", !!error.response);
    console.log("Status code:", error.response?.status);
    console.log("Request URL:", error.config?.url);
    console.log(
      "Is refresh request?:",
      error.config?.url?.includes("/auth/refresh")
    );
    console.groupEnd();
    const originalRequest = error.config;

    // Check if this is a 401 error and not a refresh request
    if (
      error.response?.status === 500 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      console.log("Attempting token refresh...");

      if (isRefreshing) {
        console.log("Refresh already in progress - queuing request");
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
        console.log("Making refresh token request");
        const { data } = await axios.post(
          "http://localhost:8080/api/auth/refreshToken",
          {},
          { withCredentials: true }
        );

        console.log("Refresh successful, new token:", data.accessToken);
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
