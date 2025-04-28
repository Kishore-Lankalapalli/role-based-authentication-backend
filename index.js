const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const db = require("./db/index.js")
const MongoDbStore = require("connect-mongodb-session")(session);

// Use environment variables for sensitive info
const MONGODB_URI = process.env.MONGODB_URI || `mongodb+srv://kishore:RTdC0n06uyDTE7D4@cluster0.ysf7n.mongodb.net/test?retryWrites=true&w=majority`;

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24, // 24 hours
});

// // Error handler for session store
// store.on('error', function(error) {
//   console.log('Session store error:', error);
// });

const authRoutes = require("./routes/auth.js");
const productRoutes = require("./routes/product.js");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret:  "Session-authentication",
    resave: false,
    saveUninitialized: false,
    store: store,
    // cookie: {
    //   maxAge: 1000 * 60 * 60 * 24, // 24 hours
    // },
  })
);

app.use("/", authRoutes);
app.use("/product", productRoutes);

app.get("/", (req, res) => 
  res.send("Express server is running successfully")
);

  app.listen(process.env.PORT || 4000, () => {
    console.log(`Server started at port 3000`);
  });


  module.exports = app;