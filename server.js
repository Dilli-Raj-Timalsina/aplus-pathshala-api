const mongoose = require("mongoose");
const express = require("");

async function main() {
  let data = await mongoose.connect("mongodb://127.0.0.1:27017/blog");
  console.log("Data base connection succesfull");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main().catch((data) => {
  console.log(data);
});
