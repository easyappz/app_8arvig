import api from "./axios";

export async function register(username, password) {
  const { data } = await api.post("/api/register", { username, password });
  return data;
}

export async function login(username, password) {
  const { data } = await api.post("/api/login", { username, password });
  return data;
}

export async function logout() {
  await api.post("/api/logout");
}

export async function getProfile() {
  const { data } = await api.get("/api/profile");
  return data;
}
