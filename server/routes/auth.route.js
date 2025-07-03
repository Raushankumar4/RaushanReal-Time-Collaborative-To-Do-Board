const { Router } = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller");

const router = Router();

router.route("/regitser").post(registerUser);
router.route("/login").post(loginUser);


module.exports = router;
