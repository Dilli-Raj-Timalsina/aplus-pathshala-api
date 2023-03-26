const mongoose = require("mongoose");
const { Schema } = mongoose;
const studentData = new Schema({
  name: { type: String, unique: false, required: false },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passport: {
    type: String,
    unique: false,
    required: true,
  },
  passport_corfirm: {
    type: String,
    unique: false,
    required: false,
  },
});
const Student = mongoose.model("Student", studentData);
module.exports = Student;
