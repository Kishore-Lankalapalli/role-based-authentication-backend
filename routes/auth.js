const express = require("express");
const {
  createNewUser,
  loginUser,
  getUsers,
  fetchUserDetails,
  fetchSpecificUserDetails,
  updateSpecificUser,
} = require("../controllers/auth");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const router = express.Router();

router.post("/signup", isAuthenticated, createNewUser);
router.post("/login", loginUser);
router.get("/users", isAuthenticated, getUsers);

router.get("/user", isAuthenticated, fetchUserDetails);
router.get("/user/:id", isAuthenticated, fetchSpecificUserDetails);
router.put("/user/:id", isAuthenticated, updateSpecificUser);

module.exports = router;
