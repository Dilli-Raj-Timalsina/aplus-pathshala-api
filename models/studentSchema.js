const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const tokenSchema = require("./tokenSchema");

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "wrong email format bro",
    },
  },
  password: {
    type: String,
    unique: false,
    required: false,
  },
  passwordConfirm: {
    type: String,
    unique: false,
    required: false,
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords are not the same!",
    },
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
  resetToken: {
    type: tokenSchema,
    default: () => ({}),
  },
  course: [{ type: Schema.Types.ObjectId, ref: "Course", required: false }],
});

//Middleware
studentSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 10);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
//Instance Methods starts over here:
studentSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

studentSchema.methods.fake = async function () {
  console.log("fake executed");
};

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
