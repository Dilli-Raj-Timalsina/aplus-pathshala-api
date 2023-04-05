const mongoose = require("mongoose");
const { Schema } = mongoose;
const studentData = new Schema({
  name: {
    type: String,
    unique: false,
    required: false,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  passport: {
    type: String,
    unique: false,
    required: true,
  },
  passport_confirm: {
    type: String,
    unique: false,
    required: true,
  },
  contact: {
    required: false,
    type: Number,
  },
  google_id: {
    type: Number,
    required: false,
    default: 100,
  },
});
//It is convention to use Model as a Uppercase first and scheme as lowercase,
const Student = mongoose.model("Student", studentData);
module.exports = Student;
