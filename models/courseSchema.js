const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  Sector: {
    required: true,
    type: String,
  },
  Category: {
    required: true,
    type: String,
  },
  Duration: {
    type: Number,
    required: true,
  },
  Price: {
    required: true,
    type: Number,
  },
  Description: {
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

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
