const asyncHandler = require("../utils/asyncHandler");
const Task = require("../models/task.model");
const response = require("../utils/response");
const Action = require("../models/action.model");
const User = require("../models/user.model");

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
    createdBy: req.user.id,
    assignedTo: req.user.id,
  });

  await Action.create({
    actionType: "created",
    task: task._id,
    user: req.user.id,
  });

  return response.success(res, "Task Created!", task);
});

const getTasks = asyncHandler(async (_, res) => {
  const tasks = await Task.find().populate("assignedTo", "fullName email");
  return response.success(res, "Tasks", tasks);
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);

  if (!task) {
    return response.error(res, "Task not found!", 404);
  }

  if (new Date(req.body.lastEditedAt) < task.lastEditedAt) {
    return response.error(res, "Conflict detected", 409);
  }

  Object.assign(task, req.body, { lastEditedAt: Date.now() });
  await task.save();

  await Action.create({
    actionType: "updated",
    task: task._id,
    user: req.user.id,
  });

  return response.success(res, "Task updated!", task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) return response.error(res, "Task Not Found!", 404);

  await Action.create({
    actionType: "deleted",
    task: task._id,
    user: req.user.id,
  });
  await task.deleteOne();
  return response.success(res, "Task Deleted!");
});

const smartAssignTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  // Getting all users
  const users = await User.find();
  if (!users.length) {
    return response.error(res, "No users found", 404);
  }

  // Counting active tasks for each user
  const taskCounts = await Promise.all(
    users.map(async (user) => {
      const activeTaskCount = await Task.countDocuments({
        assignedTo: user._id,
        status: { $in: ["Todo", "In Progress"] },
      });
      return { user, count: activeTaskCount };
    })
  );

  //  Finding the least busy user
  const leastBusy = taskCounts.reduce((min, curr) =>
    curr.count < min.count ? curr : min
  );

  //  Finding the task
  const task = await Task.findById(taskId);
  if (!task) {
    return response.error(res, "Task not found", 404);
  }

  // Assigning a task to the user who has the fewest number of active tasks
  task.assignedTo = leastBusy.user._id;
  task.lastEditedAt = new Date();
  await task.save();

  //  Returning the updated task
  return response.success(res, `Task Assigned Successfully`, task);
});

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  smartAssignTask,
};
