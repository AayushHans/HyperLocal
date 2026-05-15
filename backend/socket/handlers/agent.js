const pool = require("../../config/db");

function registerAgentHandlers(io, socket) {
  // Agent joins a specific order room when they accept the order
  socket.on("agent:join", ({ orderId }) => {
    if (!socket.user || socket.user.role !== "agent") return;
    socket.join(`order-${orderId}`);
    socket.join(`agent-${socket.user.userId}`);
    console.log(`Agent ${socket.user.userId} joined order-${orderId}`);
    io.to(`order-${orderId}`).emit("order:assigned", {
      orderId,
      agentId: socket.user.userId,
    });
  });

  // Agent broadcasts location and persists it
  socket.on("agent:location", async (data) => {
    try {
      if (!socket.user || socket.user.role !== "agent") return;
      const { orderId, lat, lng, timestamp } = data;

      io.to(`order-${orderId}`).emit("order:location", {
        orderId,
        lat,
        lng,
        timestamp: timestamp || Date.now(),
        agentId: socket.user.userId,
      });

      await pool.query(
        `UPDATE orders 
         SET current_lat = $1, current_lng = $2, tracking_updated_at = NOW(), agent_id = $3 
         WHERE id = $4`,
        [lat, lng, socket.user.userId, orderId],
      );
    } catch (err) {
      console.error("agent:location handler error", err);
    }
  });

  // Agent updates order status via socket
  socket.on("agent:status", async ({ orderId, status, message }) => {
    try {
      if (!socket.user || socket.user.role !== "agent") return;
      await pool.query(
        "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2",
        [status, orderId],
      );
      io.to(`order-${orderId}`).emit("order:status", {
        orderId,
        status,
        message,
      });
    } catch (err) {
      console.error("agent:status handler error", err);
    }
  });
}

module.exports = registerAgentHandlers;
