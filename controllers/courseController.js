const catchAsync = require("./../errors/catchAsync");
const AppError = require("./../errors/appError");
const Course = require("./../models/courseSchema");

const getAllCourse = catchAsync(async (req, res) => {
  res.end("returned all courses");
});

module.exports = {
  getAllCourse,
};
