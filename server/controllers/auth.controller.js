const asyncHandler = require("../utils/asyncHandler");
const response = require("../utils/response");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

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

module.exports = { registerUser };
