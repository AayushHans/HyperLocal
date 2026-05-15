// Centralized error handling middleware
function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err);

  // Multer file errors
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal server error" });
}

module.exports = errorHandler;
