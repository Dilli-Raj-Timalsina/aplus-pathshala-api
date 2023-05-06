const router = require("express").Router();
const {
    signupControl,
    loginControl,
    forgetControl,
    resetControl,
    logoutControl,
    protectedControl,
    protect,
} = require("../controllers/studentAuthController");
const { writeReview } = require("../controllers/reviewController");

// studentRouter route distributing:
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);
router.route("/forgetPassword").post(forgetControl);
router.route("/resetPassword").post(resetControl);
router.route("/logout").get(logoutControl);
router.route("/protected").post(protect, protectedControl);

//commenting and reviewing:
router.route("/comment").post(protect, writeReview);

module.exports = router;
