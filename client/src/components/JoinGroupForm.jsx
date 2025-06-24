import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JoinGroupForm = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("collaborator");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    setError("");

    // Validaciones básicas
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!code.trim()) {
      setError("Please enter the group code.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/group/join", {
        name,
        code,
        role,
      });

      navigate(`/group/${code}`, {
        state: {
          userName: name,
          role,
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to join the group. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Join a Group</h2>
      {error && <p style={styles.error}>{error}</p>}

      <label htmlFor="nameInput" style={styles.label}>
        Name
      </label>
      <input
        id="nameInput"
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
        disabled={loading}
      />

      <label htmlFor="codeInput" style={styles.label}>
        Group Code
      </label>
      <input
        id="codeInput"
        type="text"
        placeholder="Group Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={styles.input}
        disabled={loading}
      />

      <label htmlFor="roleSelect" style={styles.label}>
        Role
      </label>
      <select
        id="roleSelect"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={styles.select}
        disabled={loading}
      >
        <option value="collaborator">Collaborator</option>
        <option value="viewer">Viewer</option>
        <option value="moderator">Moderator</option>
      </select>

      <button
        onClick={handleJoin}
        style={styles.button}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Joining..." : "Join"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    maxWidth: "350px",
    margin: "0 auto",
  },
  label: {
    fontWeight: "600",
    color: "#00ffff",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #00ffff",
    fontSize: "1rem",
    fontFamily: "'Orbitron', sans-serif",
    backgroundColor: "#1b1c2e",
    color: "#00ffff",
  },
  select: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #00ffff",
    fontSize: "1rem",
    fontFamily: "'Orbitron', sans-serif",
    backgroundColor: "#1b1c2e",
    color: "#00ffff",
  },
  button: {
    marginTop: "1rem",
    padding: "0.75rem",
    fontSize: "1.1rem",
    fontWeight: "bold",
    fontFamily: "'Orbitron', sans-serif",
    border: "2px solid #00ffff",
    background: "transparent",
    color: "#00ffff",
    borderRadius: "0.75rem",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
  },
  error: {
    color: "#ff4d4d",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
};

export default JoinGroupForm;
