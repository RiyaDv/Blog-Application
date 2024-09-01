const express = require("express");

const {
  getUserProfile,
  getEditProfileForm,
  updateUserProfile,
  deleteUserAccount,
} = require("../controllers/userController");
const { ensureAuthenticated } = require("../middlewares/auth");
const upload = require("../config/multer");

const userRouter = express.Router();

// Render User Profile
userRouter.get("/profile", ensureAuthenticated, getUserProfile);

// Render Edit Profile Page
userRouter.get("/edit", ensureAuthenticated, getEditProfileForm);
userRouter.post(
  "/edit",
  ensureAuthenticated,
  upload.single("profilePicture"),
  updateUserProfile
);

// Delete User Account
userRouter.post("/delete", ensureAuthenticated, deleteUserAccount);

module.exports = userRouter;
