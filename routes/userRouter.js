const router = require("express").Router();
const {
    signupControl,
    loginControl,
    forgetControl,
    resetControl,
    logoutControl,
    protectedControl,
    protectStudent,
    protectTeacher,
} = require("../controllers/userAuthController");
const { profileControl } = require("../controllers/userInfoController");
const { writeReview } = require("../controllers/reviewController");

// studentAuth routes :
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);
router.route("/forgetPassword").post(forgetControl);
router.route("/resetPassword").post(resetControl);
router.route("/logout").get(logoutControl);
router.route("/protected").post(protectTeacher, protectedControl);

//studentProfile routes:
router.route("/profile").get(protectStudent, profileControl);

//commenting and reviewing:
router.route("/comment").post(writeReview);

module.exports = router;
