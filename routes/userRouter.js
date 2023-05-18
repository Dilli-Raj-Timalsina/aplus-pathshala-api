const router = require("express").Router();
const {
    signupControl,
    loginControl,
    forgetControl,
    resetControl,
    logoutControl,
    protectTeacher,
    generalProtect,
} = require("../controllers/userAuthController");
const { profileControl } = require("../controllers/userInfoController");
const { writeReview } = require("../controllers/reviewController");

// General Auth routes :
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);
router.route("/forgetPassword").post(forgetControl);
router.route("/resetPassword").post(resetControl);
router.route("/logout").get(logoutControl);

//General Profile routes:
router.route("/profile").get(profileControl);

//commenting and reviewing:
router.route("/comment").post(writeReview);

module.exports = router;
