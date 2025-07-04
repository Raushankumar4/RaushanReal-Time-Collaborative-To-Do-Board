import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API}/api/v1/`,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
