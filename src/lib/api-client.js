// lib/api-client.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 10000,
});

// Attach token to Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong!";

    if (error.response) {
      message = error.response.data?.message || message;

      // Optional: auto logout on 401
      // if (error.response.status === 401) {
      //   localStorage.removeItem("token");
      //   window.location.href = "/login";
      // }
    } else if (error.request) {
      message = "No response from server. Check your network.";
    } else {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
