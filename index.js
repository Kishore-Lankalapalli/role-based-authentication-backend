const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

// Use environment variables for sensitive info
const MONGODB_URI = process.env.MONGODB_URI || `mongodb+srv://kishore:${encodeURIComponent('Ramulu@3690')}@cluster0.ysf7n.mongodb.net/test?retryWrites=true&w=majority`;

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24, // 24 hours
});

// Error handler for session store
store.on('error', function(error) {
  console.log('Session store error:', error);
});

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product.js");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "Session-authentication",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  })
);

app.use("/", authRoutes);
app.use("/product", productRoutes);

app.get("/", (req, res) => {
  res.send("Express server is running successfully");
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log(`Server started at port 3000`);
  });
}