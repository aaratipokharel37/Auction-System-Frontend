// lib/api-client.js
import axios from "axios";
import { toast } from "sonner"; // optional, for showing toast messages

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1", // your base API
  timeout: 10000, // 10 seconds
});

// Request interceptor (optional, e.g., for adding auth token)
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

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response, // return response if successful
  (error) => {
    let message = "Something went wrong!";
    
    // Check if server sent a response
    if (error.response) {
      // Custom message from backend
      message = error.response.data?.message || message;
      // Optional: handle specific status codes
      // if (error.response.status === 401) { /* redirect to login */ }
    } else if (error.request) {
      // No response received
      message = "No response from server. Check your network.";
    } else {
      // Something else happened
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
