import axios from "axios";

const instance = axios.create({
  baseURL: "/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.request.use((config) => {
  try {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("auth_token") : null;
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
  } catch {}
  return config;
});

export default instance;
