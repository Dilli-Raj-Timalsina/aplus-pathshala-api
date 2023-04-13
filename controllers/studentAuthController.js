const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const AppError = require("../errors/appError");

const sendMail = require("./../utils/email");
const catchAsync = require("../errors/catchAsync");
const User = require("../models/studentSchema");

//all functionality related to basic signup and login using jwt:
const signToken = async (id) => {
  return await jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const loginControl = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  //1)check if email or password exist:
  if (!email || !password) {
    throw new AppError("email or password not provided", 403);
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  //3) If everything is ok: send token to the logged in user
  const token = await signToken(req.body);
  res.status(200).json({
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
    status: "success",
    token: "Bearer " + token,
  });
});

const forgetControl = catchAsync(async (req, res, next) => {
  //1) check whether user exist or not
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError("User does not exist");
  }
  //2) generate reset token:
  const resetToken = crypto.randomBytes(32).toString("hex");

  //3) update user's token with salted and hashed token :
  const hash = await bcrypt.hash(resetToken, 10);
  await User.findOneAndUpdate({ email: email }, { "child.token": hash });

  //4) preparing credentials to send user an email:
  const link = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/student/passwordReset?token=${resetToken}&id=${user._id}`;
  const options = {
    email: email,
    subject: "Reset password A+ pathshala ",
    message: `${link} \n
    click the above link to reset your password, \n
    Please Notice that this is one time reset link and don't share with others`,
  };
  //5) send reset password link to the user's email
  await sendMail(options);

  //6) if everything succeds then send success message
  res.status(200).json({
    status: "success",
    message: "checkout your email to reset password",
  });
});

//after getting reset passport url with token and userId: reset the password
const resetControl = catchAsync(async (req, res) => {
  //1) getting user reset credential :
  const { userId, token, password } = req.body;
  //2) if user doesn't exist or token is invalid
  const user = await User.findOne({ _id: userId });
  if (!user || !(await bcrypt.compare(token, user.child.token))) {
    throw new AppError("Invalid or expired password reset token");
  }
  //3) hash the password and update
  const hash = await bcrypt.hash(password, 10);
  await User.updateOne({ password: hash });
  //4) change token value to empty string
  await User.findOneAndUpdate({ _id: userId }, { "child.token": "" });

  //4) if reset is successful then send success message
  res
    .status(200)
    .json({ status: "success", message: "password reset succesful" });
});

//just for testing purpose
const logoutControl = catchAsync(async (req, res, next) => {
  res.end("logged out");
});

//just for testing purpose
const fakeControl = catchAsync(async (req, res, next) => {
  const query = User.findById(req.body);
  query.then((users) => {
    console.log(users.fake());
  });
  res.end("fake responce ended");
});

module.exports = {
  signupControl,
  loginControl,
  signToken,
  forgetControl,
  resetControl,
  logoutControl,
  fakeControl,
};
