const jwt = require("jsonwebtoken");
const Student = require("../Model/studentSchema");
const catchAsync = require("../ErrorHandeling/catchAsync");
const bcrypt = require("bcrypt");

const loginControl = catchAsync(async (req, res) => {
  throw new Error("thrown error");
});

const signupControl = catchAsync(async (req, res) => {
  const hash = await bcrypt.hash(req.body.passport, 10);
  req.body.passport = hash;
  req.body.passport_confirm = hash;
  const data = new Student(req.body);
  data
    .save()
    .then((savedDoc) => {
      res.json({
        status: "sucess",
        data: {
          savedDoc,
        },
      });
    })
    .catch((error) => {
      res.json({
        status: "Failed",
        message: { error },
      });
    });
});

const dashBoard = catchAsync(async (req, res) => {
  res.end("welcome to dashboard");
});

module.exports = { loginControl, signupControl, dashBoard };
