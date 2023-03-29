const GoogleStrategy = require("passport-google-oauth2").Strategy;
const Student = require("./../Model/studentSchema");
require("dotenv").config();

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let existingUser = await Student.findOne({ id: profile.id });
          <em>// if user exists return the user</em>;
          if (existingUser) {
            return done(null, existingUser);
          }
          <em>// if user does not exist create a new user</em>;
          console.log("Creating new user...");
          const newUser = new Student({
            method: "google",
            google: {
              id: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
            },
          });
          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};
