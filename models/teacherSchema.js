const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const tokenSchema = require("./tokenSchema");

//Teacher Schema Defination:
const teacherSchema = new Schema({
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
  child: {
    type: tokenSchema,
    default: () => ({}),
  },
});

teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  this.passwordConfirm = undefined;
  next();
});

teacherSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
