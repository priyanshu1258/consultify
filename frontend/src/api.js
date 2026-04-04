import axios from "axios";

// Create an Axios instance that defaults to the environment variable VITE_API_URL
// If the variable is not set (during local dev), it falls back to http://localhost:5000
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// You can also add interceptors here later if you want to attach JWT tokens to every request automatically
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
