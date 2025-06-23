// server/routes/group.js
import express from "express";
const router = express.Router();

// Ruta para crear un grupo
router.post("/create", async (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ error: "Faltan datos: nombre o rol" });
  }

  const groupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  console.log(`👤 ${name} Created the group ${groupCode} as ${role}`);
  res.json({ groupCode });
});

// 🔧 Nueva ruta para unirse a un grupo
router.post("/join", async (req, res) => {
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({ error: "Faltan nombre o código" });
  }

  // Aquí deberías validar si el grupo existe (si usas MongoDB). Por ahora, asumimos que sí.
  console.log(`👤 ${name} Joined the group ${code}`);

  // Retornar info del "usuario" simulado
  res.json({ user: { name, code } });
});

export default router;

