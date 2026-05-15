const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Check if user is suspended (except for admins)
    if (user.role !== "admin") {
      try {
        const userCheck = await req.db.query(
          "SELECT suspended FROM users WHERE id = $1",
          [user.userId]
        );

        if (userCheck.rows.length > 0 && userCheck.rows[0].suspended) {
          return res.status(403).json({
            error: "Account suspended",
            message: "Your account has been suspended. Please contact support.",
          });
        }
      } catch (dbError) {
        console.error("Database error in auth middleware:", dbError);
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
