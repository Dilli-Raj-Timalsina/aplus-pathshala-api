const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const tokenSchema = require("./tokenSchema");

const userSchema = new Schema({
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
    contact: {
        required: false,
        type: Number,
    },
    profilePicture: {
        required: false,
        type: String,
    },
    role: {
        type: String,
        enum: ["student", "teacher", "admin"],
        default: "student",
    },
    resetToken: {
        type: tokenSchema,
        default: () => ({}),
    },
    createdCourse: [
        { type: Schema.Types.ObjectId, ref: "Course", required: false },
    ],
    associatedCourse: [
        { type: Schema.Types.ObjectId, ref: "Course", required: false },
    ],
});

//Middleware
userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified("password")) return next();
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
//Instance Methods starts over here:
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
