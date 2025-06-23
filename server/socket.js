import Message from "./models/Message.js";

export default (socket, io) => {
  socket.on("joinGroup", async ({ groupCode, userName, role }) => {
    console.log(`${userName} se unió al grupo ${groupCode} como ${role}`);
    socket.join(groupCode);

    try {
      const messages = await Message.find({ groupCode }).sort({ timestamp: 1 });
      socket.emit("messageHistory", messages);
    } catch (err) {
      console.error("Error al obtener mensajes:", err);
    }
  });

  socket.on("message", async ({ groupCode, text, sender, timestamp }) => {
    try {
      const msg = new Message({
        groupCode,
        text,
        sender: sender || "Anónimo",
        timestamp: timestamp || new Date(),
      });

      await msg.save();

      io.to(groupCode).emit("message", msg);
    } catch (err) {
      console.error("Error al guardar mensaje:", err);
    }
  });
};
