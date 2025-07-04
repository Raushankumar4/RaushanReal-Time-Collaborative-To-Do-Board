const { Router } = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const getLatestLogs = require("../controllers/actionlog.controller");

const router = Router();

router.route("/").get(isAuthenticated, getLatestLogs);

module.exports = router;
