const mongoose = require("mongoose");
const { Schema } = mongoose;
const studentData = new Schema({
  name: {
    type: String,
    unique: false,
    required: [true, "Student Name not provided "],
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
    require: [true, "Contact Not provided"],
    type: Number,
  },
});
//It is convention to use Model as a Uppercase first and scheme as lowercase,
const Student = mongoose.model("Student", studentData);
module.exports = Student;
