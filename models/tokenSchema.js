const mongoose = require("mongoose");
const { Schema } = mongoose;
const tokenSchema = new Schema({
  token: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // this is the expiry time in seconds
  },
});
module.exports = tokenSchema;
