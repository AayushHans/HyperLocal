const pool = require("../../config/db");

function registerChatHandlers(io, socket) {
  socket.on("join-chat", async ({ orderId }) => {
    if (!socket.user) return;

    try {
      // Verify the user is the customer or assigned agent for this order
      const result = await pool.query(
        "SELECT customer_id, agent_id FROM orders WHERE id = $1",
        [orderId],
      );

      if (result.rows.length === 0) return;

      const order = result.rows[0];
      const uid = socket.user.userId;
      const isParticipant =
        socket.user.role === "admin" ||
        order.customer_id === uid ||
        order.agent_id === uid;

      if (!isParticipant) {
        console.warn(
          `User ${uid} tried to join chat for order ${orderId} without access`,
        );
        return;
      }

      socket.join(`chat-${orderId}`);
      console.log(
        `User ${uid} (${socket.user.role}) joined chat for order ${orderId}`,
      );
    } catch (err) {
      console.error("join-chat error:", err);
    }
  });

  socket.on("send-message", (message) => {
    if (!socket.user) return;
    // Attach verified sender identity — never trust client-provided senderId
    const safeMessage = {
      ...message,
      senderId: socket.user.userId,
      senderRole: socket.user.role,
    };
    io.to(`chat-${message.orderId}`).emit("chat-message", safeMessage);
  });
}

module.exports = registerChatHandlers;
