import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      enum: ["created", "updated", "deleted", "assigned", "moved"],
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActionLog", actionLogSchema);
