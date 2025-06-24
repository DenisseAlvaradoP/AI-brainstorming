import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import ChatArea from "../components/ChatArea";
import { fetchAIData } from "../utils/fetchAIData";
import io from "socket.io-client";

const socket = io("https://ai-brainstorming-6k39.onrender.com");

const GroupChat = () => {
  const { code } = useParams();
  const location = useLocation();
  const { userName, role } = location.state || { userName: "Unknown", role: "viewer" };

  const [keywords, setKeywords] = useState([]);
  const [summary, setSummary] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [notification, setNotification] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 🔁 Fetch inicial de datos al entrar (por si ya había análisis guardado)
  const updateAI = useCallback(async () => {
    const data = await fetchAIData(code);
    setKeywords(data.keywords);
    setSummary(data.summary);
    setSuggestions(data.suggestions);
  }, [code]);

  // 🔁 Llamada inicial y periódica
  useEffect(() => {
    updateAI();
    const interval = setInterval(updateAI, 10000);
    return () => clearInterval(interval);
  }, [updateAI]);

  // 🧠 Escuchar análisis por WebSocket
 useEffect(() => {
  socket.emit("joinRoom", code);

  // Notifica que hubo una actualización (opcional si mantienes updateAI)
  socket.on("aiAnalysisUpdated", () => {
    setNotification("🔄 Analysis updated by the moderator");
    updateAI();
    setTimeout(() => setNotification(""), 4000);
  });

  // ✅ ESCUCHAR resultados directamente del servidor vía WebSocket
  socket.on("aiAnalysisResult", (result) => {
    setKeywords(result.keywords || []);
    setSummary(result.summary || []);
    setSuggestions(result.suggestions || []);
    setNotification("📡 New AI analysis available");
    setTimeout(() => setNotification(""), 4000);
  });

  return () => {
    socket.off("aiAnalysisUpdated");
    socket.off("aiAnalysisResult");
  };
}, [code, updateAI]);

  // 🔍 Solo el moderador ejecuta esto
  const handleAnalyze = async () => {
    try {
      setLoadingAI(true);
      const res = await fetch(`https://ai-brainstorming-server.onrender.com/api/ai/analyze/${code}`);
      if (!res.ok) throw new Error("Error analizando");
      const data = await res.json();
      setKeywords(data.keywords);
      setSummary(data.summary);
      setSuggestions(data.suggestions);
      setNotification("✅ Analysis completed");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      setNotification("❌ Error analyzing");
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          background: "#1f2937",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Group: {code}</h2>
        <div>
          <strong>👤 {userName}</strong>{" "}
          <span style={{ fontSize: "0.8rem" }}>({role})</span>
          {role === "moderator" && (
            <button onClick={handleAnalyze} disabled={loadingAI} style={{ marginLeft: "10px" }}>
              {loadingAI ? "Analyzing..." : "🔍 Analyze"}
            </button>
          )}
        </div>
      </header>

      {notification && (
        <div
          style={{
            background: "#d1fae5",
            color: "#065f46",
            textAlign: "center",
            padding: "5px",
            fontSize: "0.9rem",
          }}
        >
          {notification}
        </div>
      )}

      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gridTemplateRows: isMobile ? "auto" : "1fr 1fr",
          gap: "8px",
          padding: "8px",
          boxSizing: "border-box",
          height: "100%",
        }}
      >
        <div
          style={{
            background: "#121212",
            color: "#00ff99",
            borderRadius: "8px",
            padding: "10px",
            overflow: "auto",
          }}
        >
          <h3 style={{ color: "#00ff99" }}>💬 Chat</h3>
          <ChatArea groupCode={code} userName={userName} role={role} />
        </div>

        <div
          style={{
            background: "#0d0d0d",
            color: "#39ff14",
            borderRadius: "8px",
            padding: "10px",
            overflow: "auto",
          }}
        >
          <h3 style={{ color: "#39ff14" }}>🧠 Keywords</h3>
          <ul>
            {keywords.map((kw, i) => (
              <li key={i}>{kw}</li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: "#0d0d0d",
            color: "#00ffff",
            borderRadius: "8px",
            padding: "10px",
            overflow: "auto",
          }}
        >
          <h3 style={{ color: "#00ffff" }}>📋 Summary</h3>
          <ol>
            {summary.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>

        <div
          style={{
            background: "#0d0d0d",
            color: "#ff0099",
            borderRadius: "8px",
            padding: "10px",
            overflow: "auto",
          }}
        >
          <h3 style={{ color: "#ff0099" }}>💡 Suggestions</h3>
          <ul>
            {suggestions.map((sug, i) => (
              <li key={i}>{sug}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default GroupChat;
