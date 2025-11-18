import React, { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage, getUsernames } from "../../api/chat.jsx";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const listRef = useRef(null);

  async function loadData() {
    try {
      const [msgs, names] = await Promise.all([getMessages(), getUsernames()]);
      setMessages(msgs);
      setUsers(names);
    } catch (e) {
      setError("Не удалось загрузить чат");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const onSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const msg = await sendMessage(text);
      setMessages((prev) => [...prev, msg]);
      setText("");
    } catch (e) {
      setError("Не удалось отправить сообщение");
    }
  };

  return (
    <div data-easytag="id5-react/src/components/Chat/index.jsx">
      <h1 style={{ marginBottom: 16 }}>Общий чат</h1>
      {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 16 }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, display: "grid", gridTemplateRows: "1fr auto", minHeight: 360 }}>
          <div ref={listRef} style={{ overflowY: "auto", paddingRight: 4 }}>
            {messages.map((m) => (
              <div key={m.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{m.author_username}</div>
                <div style={{ padding: 8, background: "#f3f4f6", borderRadius: 8 }}>{m.content}</div>
              </div>
            ))}
          </div>
          <form onSubmit={onSend} style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Введите сообщение" style={{ flex: 1, padding: 10, border: "1px solid #d1d5db", borderRadius: 8 }} />
            <button type="submit" style={{ padding: "10px 14px", border: "1px solid #111", background: "#111", color: "#fff", borderRadius: 8, cursor: "pointer" }}>Отправить</button>
          </form>
        </div>
        <aside style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Пользователи</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {users.map((u) => (
              <li key={u} style={{ padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>{u}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
