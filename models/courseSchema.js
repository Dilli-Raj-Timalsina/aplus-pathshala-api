const mongoose = require("mongoose");
const { Schema } = mongoose;

/*
In this schema, we've added several new fields to capture more information about the course:

title: The main title of the course.
subtitle: A subtitle or short description of the course.
description: A longer description of the course.
language: The language of the course.
level: The level of the course (beginner, intermediate, or advanced).
price: The price of the course.
discount: Any discount applied to the course.
image: The URL of the course image.
category: The main category of the course.
subcategory: The subcategory of the course.
duration: The total duration of the course.
lectures: The total number of lectures in the course.
students: The total number of students enrolled in the course.
requirements: An array of requirements for the course.
objectives: An array of objectives for the course.
teacher: The instructor of the course.
reviews: An array of reviews for the course.
sections: An array of sections that make up the course. Each section has a title and an array of lectures.
createdAt: The date and time the course was created.
updatedAt: The date and time the course was last updated.*/

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
        required: true,
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
    content: {
        type: String,
        required: true,
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
    teacher: [{ type: Schema.Types.ObjectId, ref: "Teacher", required: false }],
    student: [{ type: Schema.Types.ObjectId, ref: "Student", required: false }],
    review: [{ type: Schema.Types.ObjectId, ref: "Review", required: false }],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
