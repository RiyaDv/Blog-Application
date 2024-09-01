const asyncHandler = require("express-async-handler");
const Post = require("../model/Post");
const File = require("../model/File");
const cloudinary = require("../config/cloudinary");

// Render Post Form
exports.getPostForm = asyncHandler((req, res) => {
  res.render("newPost", {
    title: "Create Post",
    user: req.user,
    success: "",
    error: "",
  });
});

// Create Post
exports.createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  // Validation
  // if (!req.files || req.files.length === 0) {
  //   return res.render("newPost", {
  //     title: "Create Post",
  //     user: req.user,
  //     error: "Please provide an image",
  //     success: "",
  //   });
  // }

  const images = await Promise.all(
    req.files.map(async (file) => {
      // Save Images into Database
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });

      await newFile.save();

      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    })
  );

  // Create Post
  const newPost = new Post({
    title,
    content,
    author: req.user._id,
    images,
  });

  await newPost.save();

  res.render("newPost", {
    title: "Create Post",
    user: req.user,
    success: "Post created successfully",
    error: "",
  });
});

// Get All Posts
exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author", "username");
  res.render("posts", {
    title: "Posts",
    user: req.user,
    posts,
    success: "",
    error: "",
  });
});

// Get Post By ID
exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
        select: "username",
      },
    });

  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      error: "Post not found",
      success: "",
    });
  }

  res.render("postDetails", {
    title: "Post",
    user: req.user,
    post,
    success: "",
    error: "",
  });
});

// Get Edit Post Form
exports.getEditPostForm = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      error: "Post not found",
      success: "",
    });
  }

  res.render("editPost", {
    title: "Edit Post",
    user: req.user,
    post,
    success: "",
    error: "",
  });
});

// Update Post
exports.updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  // Find Post
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      error: "Post not found",
      success: "",
    });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      error: "You are not authorized to edit this post",
      success: "",
    });
  }

  post.title = title || post.title;
  post.content = content || post.content;

  if (req.files) {
    await Promise.all(
      post.images.map(async (image) => {
        await cloudinary.uploader.destroy(image.public_id);
      })
    );
  }
  post.images = await Promise.all(
    req.files.map(async (file) => {
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    })
  );

  await post.save();

  res.redirect(`/posts/${post._id}`);
});

// Delete Post
exports.deletePost = asyncHandler(async (req, res) => {
  // Find Post
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      error: "Post not found",
      success: "",
    });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      error: "You are not authorized to delete this post",
      success: "",
    });
  }

  await Promise.all(
    post.images.map(async (image) => {
      await cloudinary.uploader.destroy(image.public_id);
    })
  );

  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
});
