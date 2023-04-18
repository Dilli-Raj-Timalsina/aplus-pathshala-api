const catchAsync = require("./../errors/catchAsync");
const AppError = require("./../errors/appError");
const Course = require("./../models/courseSchema");

const createCourse = catchAsync(async (req, res) => {
  const course = await Course.create(req.body);
  res.end("course successfully created");
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.body;
  const updated = await Course.findByIdAndUpdate(
    id,
    { duration: "18" },
    { new: true }
  );
  console.log(updated);
  res.end("updated");
});

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
  createCourse,
  updateCourse,
};
