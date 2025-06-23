import React, { useState, useEffect, useRef } from "react";
import CreateGroupForm from "../components/CreateGroupForm";
import JoinGroupForm from "../components/JoinGroupForm";

const Home = () => {
  const [step, setStep] = useState("start");
  const fullText = "IIdeas With A Future";
  const [typedText, setTypedText] = useState("");
  const indexRef = useRef(0);
  const timeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  useEffect(() => {
    // Definimos la función dentro del useEffect para evitar advertencias de dependencias
    const typeWriter = () => {
      if (indexRef.current < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(indexRef.current));
        indexRef.current += 1;
        timeoutRef.current = setTimeout(typeWriter, 100);
      } else {
        // Cuando termina, esperamos 3 segundos y reiniciamos
        resetTimeoutRef.current = setTimeout(() => {
          setTypedText("");
          indexRef.current = 0;
          typeWriter();
        }, 3000);
      }
    };

    typeWriter();

    // Cleanup para limpiar timeouts cuando el componente se desmonte o se reejecute el efecto
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(resetTimeoutRef.current);
    };
  }, [fullText]);

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h1 style={styles.brand}>LatinxAI</h1>
        <p style={styles.subtitle}>{typedText}</p>

        {step === "start" && (
          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={() => setStep("create")}>
              Create Group
            </button>
            <button style={styles.button} onClick={() => setStep("join")}>
              Join Group
            </button>
          </div>
        )}

        {step === "create" && <CreateGroupForm />}
        {step === "join" && <JoinGroupForm />}
      </div>
    </div>
  );
};

const pixelPatternUrl =
  "https://www.transparenttextures.com/patterns/pixel-weave.png";

const styles = {
  background: {
    backgroundImage: `url(${pixelPatternUrl})`,
    backgroundColor: "#1b1c2e",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    fontFamily: "'Orbitron', sans-serif",
  },
  container: {
    background: "rgba(0, 0, 0, 0.3)",
    padding: "2.5rem",
    borderRadius: "1rem",
    boxShadow: "0 0 25px rgba(0, 255, 255, 0.15)",
    backdropFilter: "blur(12px)",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
  },
  brand: {
    fontSize: "3rem",
    color: "#00ffff",
    marginBottom: "0.2rem",
    letterSpacing: "2px",
    textShadow:
      "0 0 8px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff",
    animation: "neonGlow 1.5s ease-in-out infinite alternate",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#bbb",
    marginBottom: "2rem",
    fontWeight: "300",
    minHeight: "1.5rem",
    fontFamily: "'Courier New', Courier, monospace",
    whiteSpace: "nowrap",
    overflow: "hidden",
    borderRight: "2px solid #00ffff",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  button: {
    padding: "1rem",
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
};

// Añade esta animación CSS global para el efecto neón (en CSS global o en index.html)
/*
@keyframes neonGlow {
  from {
    text-shadow:
      0 0 8px #00ffff,
      0 0 20px #00ffff,
      0 0 30px #00ffff,
      0 0 40px #00ffff;
  }
  to {
    text-shadow:
      0 0 20px #00ffff,
      0 0 30px #00ffff,
      0 0 40px #00ffff,
      0 0 60px #00ffff;
  }
}
*/

export default Home;
