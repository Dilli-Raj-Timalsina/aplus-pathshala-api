const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
