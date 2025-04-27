const mongoose = require("mongoose");

const password = encodeURIComponent("Ramulu@3690");

// Corrected connection string with proper URL encoding
let dburl = `mongodb+srv://kishore:${password}@cluster0.ysf7n.mongodb.net/test`;

mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log("MongoDB server connected successfully");
});

db.on("disconnected", () => {
  console.log("MongoDB server disconnected");
});

db.on("error", (error) => {
  console.error("Error in connecting to MongoDB server:", error);
});

module.exports = db;
