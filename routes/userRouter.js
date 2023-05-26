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
const {
    profileControl,
    contactUsControl,
} = require("../controllers/userInfoController");
const { writeReview } = require("../controllers/reviewController");

// General Auth routes :
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);
router.route("/forgetPassword").post(forgetControl);
router.route("/resetPassword").post(generalProtect, resetControl);
router.route("/logout").get(generalProtect, logoutControl);

//General Profile routes:
router.route("/profile").get(generalProtect, profileControl);
router.route("/contactUs").post(contactUsControl);

//commenting and reviewing:
router.route("/comment").post(generalProtect, writeReview);

module.exports = router;
