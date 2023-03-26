const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const app = express();
const studentRouter = express.Router();

//installing passport and passport-jwt startegy and including them into our
//middleware stack.
const initialize = require("./Controller/passportInit");
initialize(passport);
const {
  loginControl,
  signupControl,
  getResouce,
} = require("./Controller/studentController.js");

app.use(cookieParser());
//It is used to make req.body available ,-----
//it is middleware so it should be added in middleware stack
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use("/api/v1/student", studentRouter);
studentRouter.route("/signup").post(signupControl);
studentRouter.route("/login").post(loginControl);
studentRouter.route("/resource").get(getResouce);
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: `${req.originalUrl} URL is doesnot have route handler and router is also not defined`,
  });
});

module.exports = app;
