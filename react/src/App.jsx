import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Home from "./components/Home/index.jsx";
import Register from "./components/Auth/Register/index.jsx";
import Login from "./components/Auth/Login/index.jsx";
import Profile from "./components/Profile/index.jsx";
import Chat from "./components/Chat/index.jsx";
import { getProfile } from "./api/auth.jsx";
import "./App.css";

function ProtectedRoute({ children }) {
  const [state, setState] = useState("loading");
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await getProfile();
        if (!cancelled) setState("authed");
      } catch (e) {
        if (!cancelled) setState("guest");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return <div>Загрузка...</div>;
  }
  if (state !== "authed") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export default function App() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.handleRoutes === "function") {
      window.handleRoutes(["/", "/register", "/login", "/profile", "/chat"]);
    }
  }, []);

  return (
    <div data-easytag="id1-react/src/App.jsx" className="app-shell" style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial", color: "#111", background: "#fff", minHeight: "100vh" }}>
      <nav style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid #e5e7eb" }}>
        <Link to="/" style={{ textDecoration: "none" }}>Главная</Link>
        <Link to="/register" style={{ textDecoration: "none" }}>Регистрация</Link>
        <Link to="/login" style={{ textDecoration: "none" }}>Вход</Link>
        <Link to="/profile" style={{ textDecoration: "none" }}>Профиль</Link>
        <Link to="/chat" style={{ textDecoration: "none" }}>Чат</Link>
      </nav>
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
