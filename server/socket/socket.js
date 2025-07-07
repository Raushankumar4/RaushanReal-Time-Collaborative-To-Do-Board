module.exports = function handleSocketConnection(io) {
  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    // Task updated → emit to ALL
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

    // Task drag started → broadcast to OTHERS
    socket.on("task:dragging:start", ({ taskId }) => {
      socket.broadcast.emit("task:dragging:start", {
        taskId,
        socketId: socket.id,
      });
    });

    // Task drag ended → broadcast to OTHERS
    socket.on("task:dragging:end", ({ taskId }) => {
      socket.broadcast.emit("task:dragging:end", {
        taskId,
        socketId: socket.id,
      });
    });

    // Task is moving → broadcast cursor position to OTHERS
    socket.on("task:dragging:move", ({ taskId, x, y }) => {
      socket.broadcast.emit("task:dragging:move", {
        taskId,
        x,
        y,
        socketId: socket.id,
      });
    });
  });
};
