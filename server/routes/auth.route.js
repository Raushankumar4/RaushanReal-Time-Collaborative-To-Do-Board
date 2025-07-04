const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
} = require("../controllers/auth.controller");

const router = Router();

router.route("/regitser").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/check").get(checkAuth);

module.exports = router;
