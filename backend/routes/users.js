const express = require("express");
const upload = require("../utils/multer");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const router = express.Router();

// Get all users (Admin only)
router.get(
  "/",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { role } = req.query;
      let query =
        "SELECT id, name, email, phone, role, suspended, suspended_at, created_at FROM users";
      let params = [];

      if (role) {
        query += " WHERE role = $1";
        params.push(role);
      }

      query += " ORDER BY created_at DESC";

      const result = await req.db.query(query, params);
      res.json({ users: result.rows });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get dashboard stats (Admin only)
router.get(
  "/dashboard-stats",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const stats = {};

      // Total users by role
      const userStats = await req.db.query(
        "SELECT role, COUNT(*) as count FROM users GROUP BY role",
      );
      stats.users = userStats.rows.reduce((acc, row) => {
        acc[row.role] = parseInt(row.count);
        return acc;
      }, {});

      // Order stats
      const orderStats = await req.db.query(
        "SELECT status, COUNT(*) as count FROM orders GROUP BY status",
      );
      stats.orders = orderStats.rows.reduce((acc, row) => {
        acc[row.status] = parseInt(row.count);
        return acc;
      }, {});

      // Today's orders
      const todayOrders = await req.db.query(
        "SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURRENT_DATE",
      );
      stats.todayOrders = parseInt(todayOrders.rows[0].count);

      // Active deliveries
      const activeDeliveries = await req.db.query(
        "SELECT COUNT(*) as count FROM orders WHERE status IN ('accepted', 'picked')",
      );
      stats.activeDeliveries = parseInt(activeDeliveries.rows[0].count);

      res.json({ stats });
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const result = await req.db.query(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1",
      [req.user.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile (name, phone, profile_image). PAN cannot be changed here.
router.put(
  "/profile",
  authenticateToken,
  upload.single("profile_image"),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { name, phone } = req.body;
      const profileImageFile = req.file;

      // Fetch current user
      const current = await req.db.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);
      if (current.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = current.rows[0];

      const updatedName =
        typeof name !== "undefined" && name !== null ? name : user.name;
      const updatedPhone =
        typeof phone !== "undefined" && phone !== null ? phone : user.phone;
      const updatedProfileImage = profileImageFile
        ? `/uploads/${profileImageFile.filename}`
        : user.profile_image;

      const result = await req.db.query(
        "UPDATE users SET name = $1, phone = $2, profile_image = $3 WHERE id = $4 RETURNING id, name, email, phone, role, pan_number, profile_image",
        [updatedName, updatedPhone, updatedProfileImage, userId],
      );

      res.json({ user: result.rows[0] });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Suspend user account (Admin only)
router.put(
  "/:userId/suspend",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const adminId = req.user.userId;

      // Check if user exists and is not an admin
      const userCheck = await req.db.query(
        "SELECT id, role, suspended FROM users WHERE id = $1",
        [userId],
      );

      if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = userCheck.rows[0];

      if (user.role === "admin") {
        return res.status(403).json({ error: "Cannot suspend admin users" });
      }

      if (user.suspended) {
        return res.status(400).json({ error: "User is already suspended" });
      }

      // Suspend the user
      const result = await req.db.query(
        "UPDATE users SET suspended = TRUE, suspended_at = CURRENT_TIMESTAMP, suspended_by = $1 WHERE id = $2 RETURNING id, name, email, suspended, suspended_at",
        [adminId, userId],
      );

      res.json({
        message: "User suspended successfully",
        user: result.rows[0],
      });
    } catch (error) {
      console.error("Suspend user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Unsuspend user account (Admin only)
router.put(
  "/:userId/unsuspend",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { userId } = req.params;

      // Check if user exists
      const userCheck = await req.db.query(
        "SELECT id, suspended FROM users WHERE id = $1",
        [userId],
      );

      if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = userCheck.rows[0];

      if (!user.suspended) {
        return res.status(400).json({ error: "User is not suspended" });
      }

      // Unsuspend the user
      const result = await req.db.query(
        "UPDATE users SET suspended = FALSE, suspended_at = NULL, suspended_by = NULL WHERE id = $1 RETURNING id, name, email, suspended",
        [userId],
      );

      res.json({
        message: "User unsuspended successfully",
        user: result.rows[0],
      });
    } catch (error) {
      console.error("Unsuspend user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

module.exports = router;
