import mongoose, { Collection } from "mongoose";
const { Schema } = mongoose;
const userScheme = new Schema({
  name: String,
  contact: Number,
});
const Table_Collection = mongoose.model("Table_collection", userScheme);
const Row_document = new Table_Collection({
  name: "Dilli Raj Timalsina",
  contact: 984525211,
});

module.exports = blogSchema;
