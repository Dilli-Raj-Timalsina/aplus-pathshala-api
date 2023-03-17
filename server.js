const mongoose = require("mongoose");
const express = require("express");
const app = require("./app");
const { Schema } = mongoose;

const userScheme = new Schema({
  name: String,
  contact: Number,
});

console.log(userScheme);
const Table_Collection = mongoose.model("Table_collection", userScheme);
const Row_document = new Table_Collection({
  name: "Dilli Raj Timalsina",
  contact: 984525211,
});

async function main() {
  let data = await mongoose.connect("mongodb://127.0.0.1:27017/User");
  console.log("Data base connection succesfull");
}

main().catch((data) => {
  console.log(data);
});
console.log("done");
app.listen(3000, () => {
  console.log("App is running on port 3000");
});
