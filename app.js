const express = require("express");
const app = express();
const passport = require("passport");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//basic passport configuration:
require("./authConfig/passport-jwt");
require("./authConfig/passport-google");
app.use(passport.initialize());

//Routes:
const googleAuthRouter = require("./routes/googleAuthRouter");
const studentRouter = require("./routes/studentRouter");
const teacherRouter = require("./routes/teacherRouter");

app.use(googleAuthRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/teacher", teacherRouter);

//handeling global unhandled error and rejection ,e.g if no route is defined for certain url
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: `${req.originalUrl} This is unhandled Rejection,`,
  });
});

module.exports = app;
