function registerVideoCallHandlers(io, socket) {
  socket.on("call-user", ({ orderId, signalData, from, fromName }) => {
    socket.to(`chat-${orderId}`).emit("incoming-call", {
      signal: signalData,
      from,
      fromName,
      orderId, // include so receiver can match to the right chat window
    });
  });

  socket.on("answer-call", ({ signal, to }) => {
    io.to(`chat-${to}`).emit("call-accepted", signal);
  });

  socket.on("end-call", ({ orderId }) => {
    io.to(`chat-${orderId}`).emit("call-ended");
  });
}

module.exports = registerVideoCallHandlers;
