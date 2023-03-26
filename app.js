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
//installing passport and passport-jwt startegy and including them into our
//middleware stack.
const studentRouter = express.Router();
//adding mini-application i.e studentRouter on middleware stack
app.use("/api/v1/student", studentRouter);
/*It is used to make req.body available ,
it is middleware so it should be added in middleware stack
*/
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//studentRouter route distributing:
studentRouter.route("/signup").post(signupControl);
studentRouter.route("/login").post(loginControl);
studentRouter.route("/resource").get(getResouce);

//handeling global unhandled error and rejection ,e.g if no route is defined for certain url
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: `${req.originalUrl} URL is doesnot have route handler and router is also not defined`,
  });
});

module.exports = app;
