const mongoose = require("mongoose");
const { Schema } = mongoose;

const { reviewSchema } = require("./reviewSchema");

//Define the child schema
const folderSchema = new Schema({
    folderName: String,
    folderTitle: String,
    pdfFileTitles: [String],
    videoTitles: [String],
    videoLinks: [String],
    pdfLinks: [String],
    // videoLengths: [Number],
    isFree: [Boolean],
});

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    subtitle: {
        type: String,
        trim: true,
        maxlength: 200,
    },
    duration: {
        type: Number,
        required: false,
    },
    language: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    students: {
        type: Number,
        default: 0,
        min: 0,
    },
    requirements: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    syllabus: {
        type: String,
        required: false,
    },
    bucketName: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: false,
    },
    content: [folderSchema],
    review: [reviewSchema],
    teacher: [{ type: Schema.Types.ObjectId, ref: "Teacher", required: false }],
    student: [{ type: Schema.Types.ObjectId, ref: "Student", required: false }],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
