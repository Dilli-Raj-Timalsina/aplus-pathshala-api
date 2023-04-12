const router = require("express").Router();
const {
  signupControl,
  loginControl,
  forgetControl,
  resetControl,
} = require("../controllers/teacherAuthController");

// teacher Router route distributing:
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);
router.route("/forgetPassword").post(forgetControl);
router.route("/resetPassword").post(resetControl);

module.exports = router;
