const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  stars: {
    required: true,
    type: Number,
  },
  comment: {
    required: true,
    type: String,
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
