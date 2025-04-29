const mongoose = require("mongoose");

let dburl = process.env.MONGODB_URI

mongoose.connect(dburl);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("MongoDB server connected successfully");
});

db.on("disconnected", () => {
  console.log("MongoDB server disconnected");
});

db.on("error", (error) => {
  console.error("Error in connecting to MongoDB server:", error.message);
});

module.exports = db;
