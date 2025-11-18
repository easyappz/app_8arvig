import api from "./axios";

export async function getMessages() {
  const { data } = await api.get("/api/chat/messages");
  return data;
}

export async function sendMessage(content) {
  const { data } = await api.post("/api/chat/messages", { content });
  return data;
}

export async function getUsernames() {
  const { data } = await api.get("/api/chat/users");
  return data.usernames || [];
}
