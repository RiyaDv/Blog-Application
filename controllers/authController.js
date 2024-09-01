const bcrypt = require("bcryptjs");
const User = require("../model/User");
const passport = require("passport");
const asyncHandler = require("express-async-handler");

// Render Login Page
exports.getLogin = asyncHandler((req, res) => {
  res.render("login", {
    title: "login",
    user: req.user,
    error: "",
  });
});

// Login Logic
exports.login = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render("login", {
        title: "login",
        user: req.user,
        error: info.message,
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/user/profile");
    });
  })(req, res, next);
});

// Render Register Page
exports.getRegister = asyncHandler((req, res) => {
  res.render("register", {
    title: "register",
    user: req.user,
    error: "",
  });
});

// Register Logic
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", {
        title: "register",
        user: req.user,
        error: "User Already Exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.redirect("/auth/login");
  } catch (error) {
    res.render("register", {
      title: "register",
      user: req.user,
      error: error.message,
    });
  }
});

// Logout
exports.logout = asyncHandler((req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
});
