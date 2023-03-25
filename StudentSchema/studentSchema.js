const mongoose = require("mongoose");
const { Schema } = mongoose;
const studentData = new Schema({
  name: { type: String, unique: false },
  class: Number,
  contact: Number,
  score: Number,
});
const Student = mongoose.model("Student", studentData);
module.exports = Student;
