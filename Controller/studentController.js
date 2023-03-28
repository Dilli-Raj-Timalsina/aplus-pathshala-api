const jwt = require("jsonwebtoken");
const Student = require("../Model/studentSchema");
const catchAsync = require("../ErrorHandeling/catchAsync");
const appError = require("./../ErrorHandeling/appError");
const bcrypt = require("bcrypt");
const AppError = require("./../ErrorHandeling/appError");

const loginControl = catchAsync(async (req, res) => {
  const { email, passport } = req.body;
  //check if email or passport exist:
  if (!email || !passport) {
    throw new AppError("email or passport not provided", 400);
  }
  const query = await Student.findOne({ email: email }).select("passport");
  const match = await bcrypt.compare(passport, query.passport);
  console.log(query);
  console.log(match);
  if (match) {
    res.status(400).json({
      status: "sucess",
      result: `Correct passport welcome ${email.split("@")[0]}`,
    });
  } else {
    throw new AppError("Incorrect Passport", 200);
  }
});

const signupControl = catchAsync(async (req, res) => {
  const hash = await bcrypt.hash(req.body.passport, 10);
  req.body.passport = hash;
  req.body.passport_confirm = hash;
  const data = new Student(req.body);
  data.save().then((savedDoc) => {
    res.status(200).json({
      status: "sucess",
      data: {
        savedDoc,
      },
    });
  });
});

const dashBoard = catchAsync(async (req, res) => {
  res.end("welcome to dashboard");
});

module.exports = { loginControl, signupControl, dashBoard };
