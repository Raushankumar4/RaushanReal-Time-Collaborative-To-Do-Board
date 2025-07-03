module.exports = function handleSocketConnection(io) {
  io.on("connection", (socket) => {
    console.log(`Connected ${socket.id}`);
  });
};
