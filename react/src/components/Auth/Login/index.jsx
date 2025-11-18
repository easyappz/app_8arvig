import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../../api/auth.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username.trim(), password);
      const redirectTo = location.state?.from?.pathname || "/profile";
      navigate(redirectTo);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Неверные учетные данные";
      setError(msg);
    }
  };

  return (
    <div data-easytag="id3-react/src/components/Auth/Login/index.jsx">
      <h1 style={{ marginBottom: 16 }}>Вход</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Имя пользователя</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="username" style={{ padding: 10, border: "1px solid #d1d5db", borderRadius: 8 }} />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Пароль</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••" style={{ padding: 10, border: "1px solid #d1d5db", borderRadius: 8 }} />
        </label>
        {error ? <div style={{ color: "#b91c1c" }}>{error}</div> : null}
        <button type="submit" style={{ padding: "10px 14px", border: "1px solid #111", background: "#111", color: "#fff", borderRadius: 8, cursor: "pointer" }}>Войти</button>
      </form>
    </div>
  );
}
