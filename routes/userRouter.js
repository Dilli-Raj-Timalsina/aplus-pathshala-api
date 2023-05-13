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

//studentProfile routes:
router.route("/profileStudent").get(protectStudent, profileControl);
router.route("/profileTeacher").get(protectTeacher, profileControl);

//commenting and reviewing:
router.route("/comment").post(writeReview);

module.exports = router;
