const mongoose = require("mongoose");

let dburl = `mongodb+srv://kishore:RTdC0n06uyDTE7D4@cluster0.ysf7n.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0`;

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
