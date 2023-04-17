const router = require("express").Router();
const {
  signupControl,
  loginControl,
  forgetControl,
  resetControl,
  fakeControl,
  protect,
} = require("../controllers/studentAuthController");

// studentRouter route distributing:
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);
router.route("/forgetPassword").post(forgetControl);
router.route("/resetPassword").post(resetControl);
router.route("/fake").post(protect, fakeControl);

// router
//   .route("/protected")
//   .get(passport.authenticate("jwt", { session: false }), (req, res) => {
//     res.end("authetication is successful");
//   });

module.exports = router;
