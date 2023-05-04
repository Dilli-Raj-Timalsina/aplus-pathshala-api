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
            message: "wrong email format !",
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
            message: "Passwords are not same!",
        },
    },
    contact: {
        type: Number,
        required: false,
    },
    profileImage: {
        type: String,
        required: false,
    },
    avgRating: {
        type: Number,
        required: false,
        default: 0,
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
