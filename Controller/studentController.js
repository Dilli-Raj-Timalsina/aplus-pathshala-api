const Student = require("../StudentSchema/studentSchema");
const catchAsync = require("../ErrorHandeling/catchAsync");

const loginControl = catchAsync(async (req, res) => {});
const signupControl = catchAsync(async (req, res) => {});
const dashBoard = catchAsync(async (req, res) => {});

module.exports = { loginControl, signupControl, dashBoard };
