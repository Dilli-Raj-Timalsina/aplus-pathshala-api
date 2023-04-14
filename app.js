const express = require("express");
const app = express();
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");

app.use(bodyParser.json());

app.use(mongoSanitize());
//Global Middlewares:
const helmet = require("helmet");
app.use(helmet());

const xss = require("xss-clean");
app.use(xss());
//Rate Limiter:
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use("/api", rateLimit);
//global error handler config:
const AppError = require("./errors/appError");
const globalErrorHandler = require("./errors/errorController");

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
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
