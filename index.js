const express = require("express");

const app = express();

const cors = require("cors");
const session = require("express-session");

const MongoDbStore = require("connect-mongodb-session")(session);
const password =encodeURIComponent('Ramulu@3690')


const store = new MongoDbStore({
  uri:`mongodb+srv://kishore:${password}@cluster0.ysf7n.mongodb.net/test?retryWrites=true&w=majority`,
  collection: "sessions",
});

const db = require("./db.js");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product.js")

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(
  session({
    secret: "Session-authentication",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use("/", authRoutes);
app.use("/product", productRoutes);


app.get("/", (req, res) => {
  res.send("Express server is running successfully");
});

app.listen(3000, () => {
  console.log(`Server started at port ${3000}`);
});

console.log("server started");
