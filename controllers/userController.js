const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const Post = require("../model/Post");
const cloudinary = require("../config/cloudinary");
const File = require("../model/File");
const Comment = require("../model/Comment");

// Get User Profile
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.render("login", {
      title: "Login",
      user: req.user,
      error: "User not found",
      success: "",
    });
  }

  // Fetch User's Posts
  const posts = await Post.find({ author: req.user._id }).sort(
    "-createdAt: -1"
  );

  res.render("profile", {
    title: "Profile",
    user: req.user,
    posts,
    postCount: posts.length,
    success: "",
    error: "",
  });
});

// Get Edit Profile Form
exports.getEditProfileForm = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.render("login", {
      title: "Login",
      user: req.user,
      error: "User not found",
      success: "",
    });
  }

  res.render("editProfile", {
    title: "Edit Profile",
    user,
    success: "",
    error: "",
  });
});

// Update User Profile
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, bio } = req.body;

  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.render("login", {
      title: "Login",
      user: req.user,
      error: "User not found",
      success: "",
    });
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.bio = bio || user.bio;

  if (req.file) {
    if (user.profilePicture && user.profilePicture.public_id) {
      await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }

    const file = await File({
      url: req.file.path,
      public_id: req.file.filename,
      uploaded_by: req.user._id,
    });

    await file.save();

    user.profilePicture = {
      url: file.url,
      public_id: file.public_id,
    };
  }

  console.log(user);

  await user.save();

  res.render("editProfile", {
    title: "Edit Profile",
    user,
    success: "Profile updated successfully",
    error: "",
  });
});

// Delete User Account
exports.deleteUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.render("login", {
      title: "Login",
      user,
      error: "User not found",
      success: "",
    });
  }

  // Delete User's Profile Picture
  if (user.profilePicture && user.profilePicture.public_id) {
    await cloudinary.uploader.destroy(user.profilePicture.public_id);
  }

  // Delete User's Posts and Comments
  const posts = await Post.find({ author: req.user._id });

  for (const post of posts) {
    // Delete Post's Images
    for (const image of post.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    // Delete Comments
    await Comment.deleteMany({ post: post._id });

    // Delete Post
    await Post.findByIdAndDelete(post._id);
  }

  // Delete All Comments
  await Comment.deleteMany({ author: req.user._id });

  // Delete All Files uploaded by User
  const files = await File.find({ uploaded_by: req.user._id });

  for (const file of files) {
    await cloudinary.uploader.destroy(file.public_id);
  }

  // Delete User
  await User.findByIdAndDelete(req.user._id);

  res.redirect("/");
});
