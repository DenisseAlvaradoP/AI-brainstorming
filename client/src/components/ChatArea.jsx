import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatArea = ({ groupCode, userName, role }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("joinGroup", { groupCode, userName, role });

    socket.on("messageHistory", (msgs) => setMessages(msgs));
    socket.on("message", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("messageHistory");
      socket.off("message");
    };
  }, [groupCode, userName, role]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", {
        groupCode,
        text: input,
        sender: userName || "Unknown",
        timestamp: new Date().toISOString(),
      });
      setInput("");
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messagesContainer}>
        {messages.map((msg, i) => {
          const isOwn = msg.sender === userName;
          return (
            <div
              key={i}
              style={{
                ...styles.messageRow,
                justifyContent: isOwn ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  backgroundColor: isOwn ? "#00ffff" : "#2d2d2d",
                  color: isOwn ? "#000" : "#eee",
                  borderTopLeftRadius: isOwn ? 16 : 4,
                  borderTopRightRadius: isOwn ? 4 : 16,
                }}
              >
                <div style={styles.sender}>{msg.sender || "Unknown"}</div>
                <div>{msg.text}</div>
                <div style={styles.time}>{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          type="text"
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#121212",
    borderRadius: 8,
    padding: "10px",
    boxSizing: "border-box",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    paddingBottom: "10px",
  },
  messageRow: {
    display: "flex",
    width: "100%",
  },
  bubble: {
    maxWidth: "75%",
    padding: "10px 15px",
    borderRadius: 16,
    fontSize: "0.95rem",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
  },
  sender: {
    fontSize: "0.75rem",
    fontWeight: "bold",
    color: "#00ffff",
    marginBottom: 4,
  },
  time: {
    fontSize: "0.65rem",
    marginTop: 6,
    textAlign: "right",
    color: "#aaa",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: 20,
    border: "none",
    outline: "none",
    fontSize: "1rem",
    backgroundColor: "#1e1e1e",
    color: "#eee",
  },
  button: {
    padding: "10px 20px",
    borderRadius: 20,
    border: "none",
    backgroundColor: "#00ffff",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default ChatArea;
