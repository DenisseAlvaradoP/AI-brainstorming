// routes/ai.js
import express from "express";
import Message from "../models/Message.js";
import { analyzeGroupDiscussion } from "../utils/ollama.js";
import { io } from "../index.js";

const router = express.Router();

router.get("/analyze/:groupCode", async (req, res) => {
  try {
    const { groupCode } = req.params;

    const messages = await Message.find({ groupCode }).sort({ timestamp: 1 });

    if (messages.length === 0) {
      return res.status(404).json({ error: "There are no messages in this group." });
    }

    const fullText = messages.map((m) => m.text).join("\n");
    const aiResponse = await analyzeGroupDiscussion(fullText);

    const result = {
      keywords: aiResponse.keywords || [],
      summary: aiResponse.summary || [],
      suggestions: aiResponse.suggestions || [],
    };

    // 🔊 Emitir resultado completo a todos los usuarios conectados al grupo
    io.to(groupCode).emit("aiAnalysisResult", result);

    res.json(result);
  } catch (error) {
    console.error("Error analyzing AI:", error);
    res.status(500).json({ error: "Error analyzing AI" });
  }
});

export default router;
