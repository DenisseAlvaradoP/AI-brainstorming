import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";

import connectDB from "./db/connect.js";
import handleSocket from "./socket.js";
import aiRoutes from "./routes/ai.js";
import groupRoutes from "./routes/group.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://ai-brainstorming-1.onrender.com",
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/ai", aiRoutes);
app.use("/api/group", groupRoutes);

// WebSocket
io.on("connection", (socket) => {
  handleSocket(socket, io);
});

// Conexión a la base de datos y arranque del servidor
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  });
});

// 👉 Agrega esto al final del archivo
export { io };

