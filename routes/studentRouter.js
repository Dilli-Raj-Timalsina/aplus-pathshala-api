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
const { profileControl } = require("../controllers/studentInfoController");
const { writeReview } = require("../controllers/reviewController");

// studentAuth routes :
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);
router.route("/forgetPassword").post(forgetControl);
router.route("/resetPassword").post(resetControl);
router.route("/logout").get(logoutControl);
router.route("/protected").post(protect, protectedControl);

//studentProfile routes:
router.route("/profile").get(protect, profileControl);

//commenting and reviewing:
router.route("/comment").post(writeReview);

module.exports = router;
