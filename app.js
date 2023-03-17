const express = require("express");
const app = express();

const userRouter = express.Router();

userRouter
  .route("/user")
  .get((req, res) => {
    console.log("get request done");
    res.end();
  })
  .put((req, res) => {
    res.end("Responce from put request");
  });

//adding it into out middleware stack:
app.use("/api/v1/", userRouter);
module.exports = app;
