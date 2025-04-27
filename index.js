const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);


const password = encodeURIComponent("Ramulu@3690");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  `mongodb+srv://kishore:${password}@cluster0.ysf7n.mongodb.net/test?retryWrites=true&w=majority`;

// Setup session store with proper error handling
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24 * 14, // 14 days for better user experience
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  },
});

// More comprehensive error handler for session store
store.on("error", function (error) {
  console.log("Session store error:", error);
});

const authRoutes = require("./routes/auth.js");
const productRoutes = require("./routes/product.js");

// Configure CORS for security
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? process.env.ALLOWED_ORIGIN : true,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Enhanced session configuration for serverless
app.use(
  session({
    secret: process.env.SESSION_SECRET || "Session-authentication",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
      secure: process.env.NODE_ENV === "production", // Secure in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    rolling: true, // Reset cookie expiration on activity
  })
);

// Add some base middleware for all routes
app.use((req, res, next) => {
  // Add tracking for monitoring
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/", authRoutes);
app.use("/product", productRoutes);

app.get("/", (req, res) => {
  res.send("Express server is running successfully");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? null : err.message,
  });
});

// Vercel doesn't need this listener as it uses the module.exports
// app.listen(process.env.PORT || 4000, () => {
//   console.log(`Server started at port ${process.env.PORT || 4000}`);
// });

module.exports = app;