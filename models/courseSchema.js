const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  courseName: {
    required: true,
  },
  duration: Number,
  description: String,
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
