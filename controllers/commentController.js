const Comment = require("../model/Comment");
const Post = require("../model/Post");
const asyncHandler = require("express-async-handler");

exports.addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postID = req.params.id;

  // Find Post
  const post = await Post.findById(postID);

  // Validation
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      error: "Post not found",
      success: "",
    });
  }

  if (!content) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      error: "Please provide a comment",
      success: "",
    });
  }

  // Save Comment
  const comment = new Comment({
    content,
    author: req.user._id,
    post: postID,
  });

  await comment.save();

  // Push Comment to Post
  post.comments.push(comment._id);
  await post.save();

  console.log(post);

  // Redirect
  res.redirect(`/posts/${postID}`);
});

// Get Comment Form
exports.getCommentForm = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      comment,
      error: "Post not found",
      success: "",
    });
  }

  res.render("editComment", {
    title: "Comment",
    user: req.user,
    comment,
    success: "",
    error: "",
  });
});

// Update Comment
exports.updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const commentID = req.params.id;

  // Find Comment
  const comment = await Comment.findById(commentID);

  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      comment,
      error: "Comment not found",
      success: "",
    });
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      comment,
      error: "You are not authorized to edit this comment",
      success: "",
    });
  }

  comment.content = content || comment.content;
  await comment.save();

  res.redirect(`/posts/${comment.post}`);
});

// Delete Comment
exports.deleteComment = asyncHandler(async (req, res) => {
  const commentID = req.params.id;

  // Find Comment
  const comment = await Comment.findById(commentID);

  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      comment,
      error: "Comment not found",
      success: "",
    });
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      comment,
      error: "You are not authorized to delete this comment",
      success: "",
    });
  }

  // Delete Comment
  await Comment.findByIdAndDelete(commentID);
  res.redirect(`/posts/${comment.post}`);
});
