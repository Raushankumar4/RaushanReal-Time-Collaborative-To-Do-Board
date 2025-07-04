const { Router } = require("express");
const { createTask } = require("../controllers/task.controller");
const isAuthenticated = require("../middleware/isAuthenticated");


const router = Router();

router.route("/create").post(isAuthenticated,createTask);

module.exports = router;
