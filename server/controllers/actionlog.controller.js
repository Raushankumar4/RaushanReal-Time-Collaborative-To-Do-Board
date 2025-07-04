const asyncHandler = require("../utils/asyncHandler");
const response = require("../utils/response");
const Action = require("../models/action.model");

const getLatestLogs = asyncHandler(async (_, res) => {
  const logs = await Action.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("user", "fullName")
    .populate("task", "title");
  if (!logs) {
    return response.error(res, "No Logs Found!", 404);
  }
  return response.success(res, "Logs", logs);
});

module.exports = getLatestLogs;
