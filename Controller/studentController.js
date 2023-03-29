const jwt = require("jsonwebtoken");
const Student = require("../Model/studentSchema");
const catchAsync = require("../ErrorHandeling/catchAsync");
const appError = require("./../ErrorHandeling/appError");
const bcrypt = require("bcrypt");
const AppError = require("./../ErrorHandeling/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const loginControl = catchAsync(async (req, res) => {
  const { email, passport } = req.body;
  //check if email or passport exist:
  if (!email || !passport) {
    throw new AppError("email or passport not provided", 400);
  }
  //find the passport saved in the database:
  const query = await Student.findOne({ email: email }).select("passport");
  //verify if passport matches with database hashed passport
  const match = await bcrypt.compare(passport, query.passport);
  //if match==true,then verify token
  if (match) {
    //verify token:
    const result = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.SECRET
    );
    if (result) {
      res.status(400).json({
        status: "sucess",
        result: `Correct passport welcome ${email.split("@")[0]}`,
      });
    }
  } else {
    throw new AppError("Incorrect Passport", 200);
  }
});

const signupControl = catchAsync(async (req, res) => {
  const hash = await bcrypt.hash(req.body.passport, 10);
  req.body.passport = hash;
  req.body.passport_confirm = hash;
  const user = new Student(req.body);
  const token = signToken(req.body);
  user.save().then((savedDoc) => {
    res.status(200).json({
      status: "sucess",
      token: "Bearer" + token,
      savedDoc,
    });
  });
});

const dashBoardControl = catchAsync(async (req, res) => {
  res.end("welcome to dashboard");
});

module.exports = { loginControl, signupControl, dashBoardControl };
