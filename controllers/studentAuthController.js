//jwt is used to generate jwt token and verify jwt token,
// bcrypt module does 2 things:1) salting and hashing(hash verification as well)
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../errors/appError");

const catchAsync = require("../errors/catchAsync");
const User = require("../models/studentSchema");
const { Schema, Mongoose } = require("mongoose");

//all functionality related to basic signup and login using jwt:
const signToken = async (id) => {
  return await jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const verifyPassport = async (email, passport) => {
  const query = await User.findOne({ email: email }).select("passport");
  const match = await bcrypt.compare(passport, query.passport);
  return match;
};

const hashPassport = async (pass, saltVal = 10) => {
  const hash = await bcrypt.hash(pass, saltVal);
  return hash;
};

const loginControl = catchAsync(async (req, res) => {
  const { email, passport } = req.body;

  //1)check if email or passport exist:
  if (!email || !passport) {
    throw new AppError("email or passport not provided", 403);
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  //3) If everything is ok: send token to the logged in user
  const token = await signToken(req.body);
  res.status(400).json({
    status: "success",
    token: "Bearer " + token,
  });
});

const signupControl = catchAsync(async (req, res) => {
  const user = await User.create({
    ...req.body,
  });

  // if everything is ok :send token to the user
  const token = await signToken(req.body);
  res.status(200).json({
    status: "sucess",
    token: "Bearer " + token,
  });
});

const fakeControl = catchAsync(async (req, res, next) => {
  const query = User.findById(req.body);
  query.then((users) => {
    console.log(users.fake());
  });
  res.end("fake responce ended");
});

const resetControl = catchAsync(async (req, res) => {});

module.exports = {
  signupControl,
  loginControl,
  signToken,
  resetControl,
  fakeControl,
};
