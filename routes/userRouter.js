const router = require("express").Router();
const {
    signupControl,
    loginControl,
    forgetControl,
    resetControl,
    protectTeacher,
    generalProtect,
    verifyControl,
} = require("../controllers/userAuthController");

// general authentication routes :
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);
router.route("/forgetPassword").post(forgetControl);
router.route("/verifyToken").post(verifyControl);
// router.route("/resetPassword").post(resetControl);

module.exports = router;
