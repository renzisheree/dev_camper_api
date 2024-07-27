const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetail,
  updatePassword, logout,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const router = express.Router();


router.get("/logout", logout);
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/resetpassword/:resetToken", resetPassword);
router.put("/updatedetails", protect, updateDetail);
router.put("/updatepassword", protect, updatePassword);

router.post("/forgotpassword", forgotPassword);

module.exports = router;
