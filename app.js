const express = require("express");
const app = express();
const morgan = require("morgan");
const passport = require("passport");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

require("./AuthConfig/passport-jwt");
require("./AuthConfig/passport-google");
app.use(passport.initialize());
const googleauthRouter = require("./AuthController/authRoute");

app.use(googleauthRouter);

const studentRouter = express.Router();
app.use("/api/v1/student", studentRouter);

const { signupControl, loginControl } = require("./AuthConfig/basic-jwt");
// studentRouter route distributing:
studentRouter.route("/signup").post(signupControl);
studentRouter.route("/login").post(loginControl);

studentRouter
  .route("/protected")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    res.end("authetication is successful");
  });

//testing little bit:
app.get("/query", (req, res) => {
  console.log(req.query);
  console.log(req.params);
  res.end();
});

//handeling global unhandled error and rejection ,e.g if no route is defined for certain url
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: `${req.originalUrl} This is unhandled Rejection,`,
  });
});

module.exports = app;
