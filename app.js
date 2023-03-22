const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const userRouter = express.Router();
const { loginUser, getUser } = require("./Controller/userController");

app.use(cookieParser());
//It is used to make req.body available ,-----
//it is middleware so it should be added in middleware stack
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use("/api/v1/user", userRouter);
userRouter.route("/login").post(loginUser).get(getUser);
userRouter.route("/:id").post(loginUser).get(getUser);

//unhandled route:
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: `${req.originalUrl} URL is doesnot have route handler and router is also not defined`,
  });
});

module.exports = app;
