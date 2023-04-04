const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  title: String,
  teacher: String,
  description: String,
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    rating: Number,
    length: Number,
  },
  content: {},
});
