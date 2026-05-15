const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../utils/multer");
const router = express.Router();

// Basic validators
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  // Min 8 chars, at least one letter and one number
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password)
  );
}

// Register
router.post("/register", upload.single("profile_image"), async (req, res) => {
  try {
    const { name, email, phone, password, pan_number } = req.body;
    const profileImageFile = req.file;

    // Input validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res
        .status(400)
        .json({ error: "Name must be at least 2 characters" });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }
    if (!password || !isValidPassword(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and contain letters and numbers",
      });
    }

    // Check if user exists
    const existingUser = await req.db.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase().trim()],
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Allow customer or agent self-registration — admin can never be self-assigned
    const allowedRoles = ["customer", "agent"];
    const role = allowedRoles.includes(req.body.role)
      ? req.body.role
      : "customer";

    const result = await req.db.query(
      "INSERT INTO users (name, email, phone, pan_number, profile_image, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role, pan_number, profile_image",
      [
        name.trim(),
        email.toLowerCase().trim(),
        phone || null,
        pan_number || null,
        profileImageFile ? `/uploads/${profileImageFile.filename}` : null,
        hashedPassword,
        role,
      ],
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await req.db.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase().trim(),
    ]);

    // Use constant-time comparison path regardless of whether user exists
    const user = result.rows[0];
    const dummyHash =
      "$2a$12$invalidhashfortimingprotection000000000000000000000000";
    const isValid = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, dummyHash);

    if (!user || !isValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (user.suspended && user.role !== "admin") {
      return res.status(403).json({
        error: "Account suspended",
        message: "Your account has been suspended. Please contact support.",
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        suspended: user.suspended || false,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
