module.exports = function handleSocketConnection(io) {
  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    // Task updated → emit to ALL (including sender)
    socket.on("task:updated", (data) => {
      io.emit("task:updated", data);
    });

    // Task created → emit to ALL
    socket.on("task:created", (data) => {
      io.emit("task:created", data);
    });

    // Task deleted → emit to ALL
    socket.on("task:deleted", (data) => {
      io.emit("task:deleted", data);
    });

    // Log added → emit to ALL
    socket.on("log:added", (data) => {
      io.emit("log:added", data);
    });
  });
};
