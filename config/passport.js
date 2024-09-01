const User = require("../model/User");
const bcrypt = require("bcryptjs");

const LocalStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  // Defined the Local Strategy for email and password Authentication
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Find User
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, {
              message: "User Not Found with that Email",
            });
          }

          // Compare the provided password with the hashed password in the database
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, {
              message: "Incorrect Password",
            });
          }

          // Authentication is successful, return the user object
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serializing the User: Determines which data of the user object should be stored in the session. Here, the user ID is stored.
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserializing the User: Used to fetch the user object from the session. Here, the user ID is used to fetch the user from the database.
  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
