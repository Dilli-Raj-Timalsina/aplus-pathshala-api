const router = require("express").Router();
const {
    signupControl,
    loginControl,
    forgetControl,
    resetControl,
    logoutControl,
    fakeControl,
    protect,
} = require("../controllers/studentAuthController");
const { writeReview } = require("../controllers/reviewController");

// studentRouter route distributing:
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);
router.route("/forgetPassword").post(forgetControl);
router.route("/resetPassword").post(resetControl);
router.route("/logout").get(logoutControl);
//commenting and reviewing:
router.route("/comment").post(writeReview);

module.exports = router;
