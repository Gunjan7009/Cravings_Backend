const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
} = require("../controllers/authcontroller");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", authMiddleware, logoutUser);
module.exports = router;
