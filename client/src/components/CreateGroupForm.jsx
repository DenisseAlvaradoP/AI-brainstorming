import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateGroupForm = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("collaborator");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) return alert("Please enter your name.");
    try {
      const res = await axios.post("https://ai-brainstorming-6k39.onrender.com/api/group/create", {
        name,
        role,
      });

      const { groupCode } = res.data;

      navigate(`/group/${groupCode}`, {
        state: { userName: name, role },
      });
    } catch (error) {
      alert("Failed to create group. Please try again.");
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.title}>Create Group</h2>
      <input
        style={styles.input}
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        style={styles.select}
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="collaborator">Collaborator</option>
        <option value="viewer">Viewer</option>
        <option value="moderator">Moderator</option>
      </select>
      <button style={styles.button} onClick={handleCreate}>
        Generate
      </button>
    </div>
  );
};

const styles = {
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    background: "rgba(0, 0, 0, 0.25)",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 0 20px rgba(0, 255, 255, 0.15)",
    color: "#fff",
    maxWidth: "400px",
    margin: "0 auto",
    fontFamily: "'Orbitron', sans-serif",
  },
  title: {
    fontSize: "1.8rem",
    color: "#00ffff",
    textAlign: "center",
    marginBottom: "1rem",
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "2px solid #00ffff",
    backgroundColor: "transparent",
    color: "#fff",
    outline: "none",
  },
  select: {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "2px solid #00ffff",
    backgroundColor: "#111", // fondo oscuro
    color: "#fff",           // texto claro
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
  },
  button: {
    padding: "0.8rem",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "0.5rem",
    border: "2px solid #00ffff",
    backgroundColor: "transparent",
    color: "#00ffff",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default CreateGroupForm;
