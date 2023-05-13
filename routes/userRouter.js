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
router.route("/signup").post(generalProtect, signupControl);
router.route("/login").post(generalProtect, loginControl);
router.route("/forgetPassword").post(generalProtect, forgetControl);
router.route("/resetPassword").post(generalProtect, resetControl);
router.route("/logout").get(generalProtect, logoutControl);

//General Profile routes:
router.route("/profile").get(generalProtect, profileControl);

//commenting and reviewing:
router.route("/comment").post(writeReview);

module.exports = router;
