const express = require("express");
const {
  createNewUser,
  loginUser,
  getUsers,
  fetchUserDetails,
} = require("../controllers/auth");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const router = express.Router();

router.post("/signup", createNewUser);
router.post("/login", loginUser);
router.get("/users",isAuthenticated, getUsers);

router.get("/user", isAuthenticated, fetchUserDetails);

module.exports = router;
