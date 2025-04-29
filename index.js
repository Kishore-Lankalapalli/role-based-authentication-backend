const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const db = require("./db/index.js");
const MongoDbStore = require("connect-mongodb-session")(session);

// Use environment variables for sensitive info
const MONGODB_URI =
  process.env.MONGODB_URI 

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 1000 * 60 * 4,
  touchAfter: 240,
});

const authRoutes = require("./routes/auth.js");
const productRoutes = require("./routes/product.js");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "Session-authentication",
    resave: false,
    saveUninitialized: false,
    store: store,

    name: "session-id",
    rolling: false,
    cookie: {
      maxAge: 1000 * 60 * 4,
    },
  })
);

app.use("/", authRoutes);
app.use("/product", productRoutes);

app.get("/", (req, res) => res.send("Express server is running successfully"));

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server started at port 3000`);
});

module.exports = app;
