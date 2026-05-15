const express = require("express");
const { StreamChat } = require("stream-chat");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

// Lazy-init so missing keys don't crash the whole server at startup
let serverClient = null;
function getClient() {
  if (!serverClient) {
    if (!process.env.STREAM_API_KEY || !process.env.STREAM_API_SECRET) {
      throw new Error("Stream API keys not configured");
    }
    serverClient = StreamChat.getInstance(
      process.env.STREAM_API_KEY,
      process.env.STREAM_API_SECRET,
    );
  }
  return serverClient;
}

// Generate a Stream token for the logged-in user
router.get("/token", authenticateToken, async (req, res) => {
  try {
    const client = getClient();
    const { userId, email, role } = req.user;
    const streamUserId = `user-${userId}`;

    const dbUser = await req.db.query(
      "SELECT name, profile_image FROM users WHERE id = $1",
      [userId],
    );
    const name = dbUser.rows[0]?.name || email;
    const image = dbUser.rows[0]?.profile_image || null;

    // Upsert user — omit role field to avoid Stream role config issues
    await client.upsertUser({
      id: streamUserId,
      name,
      ...(image && { image }),
    });

    const token = client.createToken(streamUserId);

    res.json({
      token,
      userId: streamUserId,
      apiKey: process.env.STREAM_API_KEY,
    });
  } catch (err) {
    console.error("Stream token error:", err?.message || err);
    res
      .status(500)
      .json({ error: err?.message || "Failed to generate Stream token" });
  }
});

// Create or get a Stream channel for an order
router.post("/channel/:orderId", authenticateToken, async (req, res) => {
  try {
    const client = getClient();
    const { orderId } = req.params;
    const { userId, role } = req.user;

    const orderResult = await req.db.query(
      "SELECT customer_id, agent_id FROM orders WHERE id = $1",
      [orderId],
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { customer_id, agent_id } = orderResult.rows[0];

    const isParticipant =
      role === "admin" || userId === customer_id || userId === agent_id;

    if (!isParticipant) {
      return res.status(403).json({ error: "Not a participant of this order" });
    }

    const members = [`user-${customer_id}`];
    if (agent_id) members.push(`user-${agent_id}`);

    // Upsert all members so Stream knows about them before channel creation
    const memberIds = [customer_id, agent_id].filter(Boolean);
    const memberRows = await req.db.query(
      "SELECT id, name FROM users WHERE id = ANY($1::int[])",
      [memberIds],
    );
    await client.upsertUsers(
      memberRows.rows.map((u) => ({ id: `user-${u.id}`, name: u.name })),
    );

    const channel = client.channel("messaging", `order-${orderId}`, {
      name: `Order #${orderId}`,
      members,
      created_by_id: `user-${userId}`,
    });

    await channel.create();

    res.json({ channelId: `order-${orderId}`, channelType: "messaging" });
  } catch (err) {
    console.error("Stream channel error:", err?.message || err);
    res.status(500).json({ error: err?.message || "Failed to create channel" });
  }
});

module.exports = router;
