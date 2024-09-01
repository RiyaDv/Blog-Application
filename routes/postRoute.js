const express = require("express");
const {
  getPostForm,
  createPost,
  getPosts,
  getPostById,
  getEditPostForm,
  deletePost,
  updatePost,
} = require("../controllers/postController");
const upload = require("../config/multer");
const { ensureAuthenticated } = require("../middlewares/auth");

const postRoutes = express.Router();

// Get Post Form
postRoutes.get("/add", getPostForm);

// Post Logic
postRoutes.post(
  "/add",
  ensureAuthenticated,
  upload.array("images", 5),
  createPost
);

// Get all Post
postRoutes.get("/", getPosts);

// Get Post By ID
postRoutes.get("/:id", getPostById);

// Edit Post
postRoutes.get("/:id/edit", getEditPostForm);

// Update Post
postRoutes.put(
  "/:id",
  ensureAuthenticated,
  upload.array("images", 5),
  updatePost
);

// Delete Post
postRoutes.delete("/:id", ensureAuthenticated, deletePost);

module.exports = postRoutes;
