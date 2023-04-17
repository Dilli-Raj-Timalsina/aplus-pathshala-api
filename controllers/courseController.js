const catchAsync = require("./../errors/catchAsync");
const AppError = require("./../errors/appError");
const Course = require("./../models/courseSchema");

const createCourse = async (req, res) => {};

const getAllCourse = catchAsync(async (req, res) => {
  console.log(req.user);
  res.end("all course");
});
const getCourse = catchAsync(async (req, res) => {});
const filterCourse = catchAsync(async (req, res) => {});
const sortCourse = catchAsync(async (req, res) => {});
const myCourse = catchAsync(async (req, res) => {});

module.exports = {
  getAllCourse,
  getCourse,
  filterCourse,
  sortCourse,
  myCourse,
};
