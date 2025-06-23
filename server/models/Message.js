// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  groupCode: { type: String, required: true },
  text: { type: String, required: true },
  sender: { type: String, default: "Anónimo" },
  timestamp: { type: Date, default: Date.now }, // CAMBIO AQUÍ
});

export default mongoose.model("Message", MessageSchema);

