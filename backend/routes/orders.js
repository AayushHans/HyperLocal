const express = require("express");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const { processOrderText } = require("../utils/nlpProcessor");
const router = express.Router();

const VALID_STATUSES = [
  "pending",
  "accepted",
  "picked",
  "delivered",
  "cancelled",
];

// Create order (Customer only)
router.post(
  "/",
  authenticateToken,
  authorizeRole(["customer"]),
  async (req, res) => {
    try {
      const {
        items_text,
        category,
        pickup_address,
        delivery_address,
        pickup_lat,
        pickup_lng,
        delivery_lat,
        delivery_lng,
      } = req.body;

      if (!items_text || !category || !pickup_address || !delivery_address) {
        return res.status(400).json({
          error:
            "items_text, category, pickup_address and delivery_address are required",
        });
      }

      const customer_id = req.user.userId;

      const result = await req.db.query(
        `INSERT INTO orders (customer_id, items_text, category, pickup_address, delivery_address, pickup_lat, pickup_lng, delivery_lat, delivery_lng) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          customer_id,
          items_text,
          category,
          pickup_address,
          delivery_address,
          pickup_lat,
          pickup_lng,
          delivery_lat,
          delivery_lng,
        ],
      );

      const order = result.rows[0];

      // Add initial order update
      await req.db.query(
        "INSERT INTO order_updates (order_id, status, message) VALUES ($1, $2, $3)",
        [order.id, "pending", "Order placed successfully"],
      );

      // Broadcast to all agents
      req.io.to("agents").emit("new-order", order);

      res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get available orders (Agent only)
router.get(
  "/available",
  authenticateToken,
  authorizeRole(["agent"]),
  async (req, res) => {
    try {
      const result = await req.db.query(
        `SELECT o.*, u.name as customer_name, u.phone as customer_phone 
       FROM orders o 
       JOIN users u ON o.customer_id = u.id 
       WHERE o.status = 'pending' 
       ORDER BY o.created_at DESC`,
      );

      res.json({ orders: result.rows });
    } catch (error) {
      console.error("Get available orders error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Accept order (Agent only)
router.post(
  "/:id/accept",
  authenticateToken,
  authorizeRole(["agent"]),
  async (req, res) => {
    try {
      const orderId = req.params.id;
      const agentId = req.user.userId;

      // Check if order is still available
      const orderCheck = await req.db.query(
        "SELECT * FROM orders WHERE id = $1 AND status = $2",
        [orderId, "pending"],
      );
      if (orderCheck.rows.length === 0) {
        return res.status(400).json({ error: "Order not available" });
      }

      // Update order
      const result = await req.db.query(
        "UPDATE orders SET agent_id = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
        [agentId, "accepted", orderId],
      );

      const order = result.rows[0];

      // Add order update
      await req.db.query(
        "INSERT INTO order_updates (order_id, status, message) VALUES ($1, $2, $3)",
        [orderId, "accepted", "Order accepted by delivery partner"],
      );

      // Notify customer
      req.io.to(`user-${order.customer_id}`).emit("order-update", {
        orderId,
        status: "accepted",
        message: "Your order has been accepted by a delivery partner",
      });

      res.json({ message: "Order accepted successfully", order });
    } catch (error) {
      console.error("Accept order error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Update order status (Agent only)
router.put(
  "/:id/status",
  authenticateToken,
  authorizeRole(["agent"]),
  async (req, res) => {
    try {
      const orderId = req.params.id;
      const { status, message } = req.body;
      const agentId = req.user.userId;

      if (!status || !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
        });
      }

      // Verify agent owns this order
      const orderCheck = await req.db.query(
        "SELECT * FROM orders WHERE id = $1 AND agent_id = $2",
        [orderId, agentId],
      );
      if (orderCheck.rows.length === 0) {
        return res
          .status(403)
          .json({ error: "Unauthorized to update this order" });
      }

      // Update order
      const result = await req.db.query(
        "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [status, orderId],
      );

      const order = result.rows[0];

      // Add order update
      await req.db.query(
        "INSERT INTO order_updates (order_id, status, message) VALUES ($1, $2, $3)",
        [orderId, status, message || `Order status updated to ${status}`],
      );

      // Notify customer
      req.io.to(`user-${order.customer_id}`).emit("order-update", {
        orderId,
        status,
        message: message || `Order status updated to ${status}`,
      });

      res.json({ message: "Order status updated successfully", order });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get user's orders
router.get("/my-orders", authenticateToken, async (req, res) => {
  try {
    let query;
    let params = [req.user.userId];

    if (req.user.role === "customer") {
      query = `SELECT o.*, u.name as agent_name, u.phone as agent_phone 
               FROM orders o 
               LEFT JOIN users u ON o.agent_id = u.id 
               WHERE o.customer_id = $1 
               ORDER BY o.created_at DESC`;
    } else if (req.user.role === "agent") {
      query = `SELECT o.*, u.name as customer_name, u.phone as customer_phone 
               FROM orders o 
               JOIN users u ON o.customer_id = u.id 
               WHERE o.agent_id = $1 
               ORDER BY o.created_at DESC`;
    }

    const result = await req.db.query(query, params);
    res.json({ orders: result.rows });
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all orders (Admin only)
router.get(
  "/all",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { status } = req.query;
      if (status && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Invalid status filter` });
      }
      let query = `SELECT o.*, 
                        c.name as customer_name, c.email as customer_email,
                        a.name as agent_name, a.email as agent_email
                 FROM orders o 
                 JOIN users c ON o.customer_id = c.id 
                 LEFT JOIN users a ON o.agent_id = a.id`;

      let params = [];
      if (status) {
        query += " WHERE o.status = $1";
        params.push(status);
      }

      query += " ORDER BY o.created_at DESC";

      const result = await req.db.query(query, params);
      res.json({ orders: result.rows });
    } catch (error) {
      console.error("Get all orders error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get order updates
router.get("/:id/updates", authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;

    const result = await req.db.query(
      "SELECT * FROM order_updates WHERE order_id = $1 ORDER BY timestamp ASC",
      [orderId],
    );

    res.json({ updates: result.rows });
  } catch (error) {
    console.error("Get order updates error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// NLP Processing for order items
router.post("/process-nlp", authenticateToken, async (req, res) => {
  try {
    const { text, category } = req.body;

    if (!text || text.trim().length < 10) {
      return res.json({
        suggestion: text,
        detectedLanguage: null,
        needsClarification: false,
      });
    }

    // Process text using NLP processor
    const processed = processOrderText(text, category);

    // Only return suggestion if clarification is needed
    if (processed.needsClarification) {
      res.json({
        suggestion: processed.clarifiedText,
        detectedLanguage: processed.language,
        confidence: processed.confidence,
      });
    } else {
      res.json({
        suggestion: null,
        detectedLanguage: processed.language,
        confidence: processed.confidence,
      });
    }
  } catch (error) {
    console.error("NLP processing error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
