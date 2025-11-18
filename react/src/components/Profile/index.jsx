import React, { useEffect, useState } from "react";
import { getProfile, logout } from "../../api/auth.jsx";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (e) {
        setError("Ошибка загрузки профиля");
      }
    })();
  }, []);

  const onLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch {}
  };

  return (
    <div data-easytag="id4-react/src/components/Profile/index.jsx">
      <h1 style={{ marginBottom: 16 }}>Профиль</h1>
      {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}
      {profile ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div><b>Имя пользователя:</b> {profile.username}</div>
          <button onClick={onLogout} style={{ padding: "10px 14px", border: "1px solid #111", background: "#111", color: "#fff", borderRadius: 8, cursor: "pointer", width: 160 }}>Выйти</button>
        </div>
      ) : (
        <div>Загрузка...</div>
      )}
    </div>
  );
}
