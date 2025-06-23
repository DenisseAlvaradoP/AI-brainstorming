import React from "react";

const Sidebar = ({ keywords, summary, suggestions }) => {
  return (
    <div style={styles.sidebar}>
      <Section title="🔑 Keywords" color="#a29bfe" items={keywords} />
      <Section title="📝 Summary Ideas" color="#00cec9" items={summary} numbered />
      <Section title="🤖 AI Suggestions" color="#fd79a8" items={suggestions} />
    </div>
  );
};

const Section = ({ title, color, items, numbered }) => (
  <div style={{ ...styles.card, borderColor: color }}>
    <h3 style={{ ...styles.title, color }}>{title}</h3>
    <ul style={styles.list}>
      {items.map((item, i) => (
        <li key={i}>
          {numbered ? `${i + 1}. ` : ""}
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const styles = {
  sidebar: {
    width: "320px",
    padding: "1rem",
    backgroundColor: "#1e1e2f",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    height: "100vh",
    overflowY: "auto",
    borderRight: "2px solid #444",
  },
  card: {
    backgroundColor: "#2d2d44",
    border: "2px solid",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.05)",
    transition: "transform 0.2s ease-in-out",
  },
  title: {
    marginBottom: "0.75rem",
    fontWeight: "bold",
    fontSize: "1.1rem",
    textShadow: "0 0 5px rgba(255,255,255,0.3)",
  },
  list: {
    paddingLeft: "1rem",
    color: "#ffffffcc",
    lineHeight: 1.6,
  },
};

export default Sidebar;
