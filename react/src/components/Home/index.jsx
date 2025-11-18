import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div data-easytag="id6-react/src/components/Home/index.jsx" style={{ display: "grid", gap: 12 }}>
      <h1>Главная</h1>
      <p>Добро пожаловать! Используйте ссылки ниже для навигации.</p>
      <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/register">Регистрация</Link>
        <Link to="/login">Вход</Link>
        <Link to="/profile">Профиль</Link>
        <Link to="/chat">Чат</Link>
      </nav>
    </div>
  );
}
