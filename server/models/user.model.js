const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [10, "Password must be at least 10 characters"],
      maxlength: [14, "Password must be at most 14 characters"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
