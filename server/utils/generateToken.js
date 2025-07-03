const jwt = require("jsonwebtoken");

module.exports = function generateToken(user) {
  try {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
    return token;
  } catch (error) {
    console.error("JWT generation error:", error);
    return null;
  }
};
