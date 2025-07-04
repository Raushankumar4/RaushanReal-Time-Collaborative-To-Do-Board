const asyncHandler = require("../utils/asyncHandler");
const response = require("../utils/response");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return response.error(res, "All fields are required!", 400);
  }

  const existUser = await User.findOne({ email });

  if (existUser) {
    return response.error(res, "User already exists with this email", 409);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashPassword,
  });

  if (!user) {
    return response.error(res, "Something went wrong!", 500);
  }

  return response.success(res, "Registered", user, 201);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return response.error(res, "All fields are required!", 400);
  }

  let user = await User.findOne({ email });
  if (!user) {
    return response.error(res, "User Not Found with this email", 404);
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return response.error(res, "Incorrect password!", 401);
  }
  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return response.success(res, "Login successful", {
    fullName: user.fullName,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return response.success(res, "Logout successful");
});

const checkAuth = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ authenticated: true, user: payload });
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ authenticated: false });
  }
};

module.exports = { registerUser, loginUser, logoutUser, checkAuth };
