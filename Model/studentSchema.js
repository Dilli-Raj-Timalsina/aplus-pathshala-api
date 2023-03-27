const mongoose = require("mongoose");
const { Schema } = mongoose;
const studentData = new Schema({
  name: { type: String, unique: false, required: false },
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
  passport_corfirm: {
    type: String,
    unique: false,
    required: false,
  },
  contact: {
    require: [true, "Contact Not provided"],
    type: Number,
  },
});
const Student = mongoose.model("Student", studentData);
module.exports = Student;
