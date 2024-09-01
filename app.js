require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute");
const passportConfig = require("./config/passport");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const postRoutes = require("./routes/postRoute");
const errorHandler = require("./middlewares/errorHandler");
const commentRoutes = require("./routes/commentRoute");
const authRoutes = require("./routes/authRoute");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware: Passing form data
app.use(express.urlencoded({ extended: true }));

// Middleware: Session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
  })
);

// Middleware: Method Override
app.use(methodOverride("_method"));

// Middleware: Passport
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// EJS
app.set("view engine", "ejs");

// Home route
app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
    error: "",
    title: "Home",
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/", commentRoutes);
app.use("/user", userRouter);

// Middleware: Error Handling
app.use(errorHandler);

// Start the server
mongoose
  .connect(process.env.MONGODB_URL)
  .then((data) => {
    app.listen(PORT, () => {
      console.log("DB connected");

      console.log(`Server is Running on ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Database connection failed");
  });
