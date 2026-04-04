import axios from "axios";

// Create an Axios instance that defaults to the environment variable VITE_API_URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
