const express = require("express");
const commentRoutes = express.Router();
const { ensureAuthenticated } = require("../middlewares/auth");
const {
  addComment,
  getCommentForm,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

// Add Comment
commentRoutes.post("/posts/:id/comments", ensureAuthenticated, addComment);

// Get Comment Form
commentRoutes.get("/comments/:id/edit", getCommentForm);

// Update Comment
commentRoutes.put("/comments/:id", ensureAuthenticated, updateComment);

// Delete Comment
commentRoutes.delete("/comments/:id", ensureAuthenticated, deleteComment);

module.exports = commentRoutes;
