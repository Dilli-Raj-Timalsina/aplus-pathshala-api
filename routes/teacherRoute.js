const router = require("express").Router();
const { signupControl, loginControl } = require("./Controller/authController");

// studentRouter route distributing:
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);

router
  .route("/protected")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    res.end("authetication is successful");
  });

module.exports = router;
