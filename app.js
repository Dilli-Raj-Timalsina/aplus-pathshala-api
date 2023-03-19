const express = require("express");
const app = express();
const userRouter = express.Router();
const { postUser, getUser } = require("./Controller/userController");

//It is used to make req.body available ,-----
//it is middleware so it should be added in middleware stack
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use("/api/v1/user", userRouter);
userRouter.route("/name").post(postUser).get(getUser);
userRouter.route("/:id").post(postUser).get(getUser);

module.exports = app;
