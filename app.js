const express = require("express");
const app = express();
const userRouter = express.Router();
const postUser = require("./Controller/userController");

//It is used to make req.body available ,it is middleware so it should be added in middleware stack
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use("/api/v1/user", userRouter);

userRouter.route("/").post(postUser);
module.exports = app;
