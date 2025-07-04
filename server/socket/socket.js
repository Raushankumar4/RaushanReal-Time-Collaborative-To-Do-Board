module.exports = function handleSocketConnection(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    // Task updated → broadcast to others
    socket.on("task:updated", (data) => {
      socket.broadcast.emit("task:updated", data);
    });

    // Task created
    socket.on("task:created", (data) => {
      socket.broadcast.emit("task:created", data);
    });

    // Task deleted
    socket.on("task:deleted", (data) => {
      socket.broadcast.emit("task:deleted", data);
    });

    // Log updated (optional)
    socket.on("log:added", (data) => {
      socket.broadcast.emit("log:added", data);
    });
  });
};
