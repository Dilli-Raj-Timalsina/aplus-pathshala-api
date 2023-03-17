const mongoose = require("mongoose");
const { Schema } = mongoose;
const studentData = new Schema({
  name: String,
  contact: Number,
});
const Student = mongoose.model("Student", studentData);

module.exports = Student;
