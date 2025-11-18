import api from "./axios";

export async function register(username, password) {
  const { data } = await api.post("/api/register", { username, password });
  if (data && data.token) {
    window.localStorage.setItem("auth_token", data.token);
  }
  return data;
}

export async function login(username, password) {
  const { data } = await api.post("/api/login", { username, password });
  if (data && data.token) {
    window.localStorage.setItem("auth_token", data.token);
  }
  return data;
}

export async function logout() {
  await api.post("/api/logout");
  window.localStorage.removeItem("auth_token");
}

export async function getProfile() {
  const { data } = await api.get("/api/profile");
  return data;
}
