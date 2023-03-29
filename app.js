/*app is default export of express module , It is the main middleware through which 
req,res objects
travels ,so if we want to include anything in our express app then we mush have to add it on our 
app middleware stack i.e app.use(middleware); 
*/

const express = require("express");
/* creating student router .It is like a mini express application and It has it's own 
middleware stack .
*/
const app = express();
/*It is used to make req.body available ,
it is middleware so it should be added in middleware stack
*/
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const studentRouter = express.Router();
//adding mini-application i.e studentRouter on middleware stack
app.use("/api/v1/student", studentRouter);

//Including studentController methods in out application:
const {
  signupControl,
  dashBoardControl,
  loginControl,
} = require("./Controller/studentController");

//passport configuration:
const passport = require("passport");
const initialize = require("./Controller/passportInit");
app.use(passport.initialize());
initialize();
require("./passportConfig")(passport);

//passport google auth setting
<em>// Redirect the user to the Google signin page</em>;
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
<em>// Retrieve user data using the access token received</em>;
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.redirect("/profile/");
  }
);
<em>// profile route after successful sign in</em>;
app.get("/profile", (req, res) => {
  console.log(req);
  res.send("Welcome");
});

// studentRouter route distributing:
studentRouter.route("/signup").post(signupControl);
studentRouter.route("/login").post(loginControl);
app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.end("authetication is successful");
  }
);

//handeling global unhandled error and rejection ,e.g if no route is defined for certain url
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: `${req.originalUrl} URL is doesnot have route handler and router is also not defined`,
  });
});

module.exports = app;
