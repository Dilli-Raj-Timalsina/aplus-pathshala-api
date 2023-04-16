const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  sector: {
    required: true,
    type: String,
  },
  category: {
    required: true,
    type: String,
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    required: true,
    type: Number,
  },
  description: {
    required: true,
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  student: [{ type: Schema.Types.ObjectId, ref: "Student", required: false }],
  review: [{ type: Schema.Types.ObjectId, ref: "Review", required: false }],
});

console.log(courseSchema.path("content"));

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
