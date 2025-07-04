const asyncHandler = require("../utils/asyncHandler");
const Task = require("../models/task.model");
const response = require("../utils/response");
const Action = require("../models/action.model");

const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority } = req.body;
  if (!req.body) {
    return response.error(res, "Missing request body", 400);
  }

  const existing = await Task.findOne({ title });
  if (existing) return response.error(res, "Title must be unique", 400);

  const task = await Task.create({
    title,
    description,
    priority,
    assignedTo: req.user.id,
  });

  await Action.create({
    actionType: "created",
    task: task._id,
    user: req.user.id,
  });

  return response.success(res, "Task Created!", task);
});

module.exports = { createTask };
