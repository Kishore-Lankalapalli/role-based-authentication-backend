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
router.get("/users", getUsers);

router.get("/user", fetchUserDetails);

module.exports = router;
