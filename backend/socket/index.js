const jwt = require("jsonwebtoken");
const registerAgentHandlers = require("./handlers/agent");

function initSocket(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} — user ${socket.user.userId}`);

    // Personal room for order notifications
    socket.join(`user-${socket.user.userId}`);

    // Agents join shared room for new order broadcasts
    if (socket.user.role === "agent") {
      socket.join("agents");
    }

    // Agent location + status updates (still via Socket.IO)
    registerAgentHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSocket;
