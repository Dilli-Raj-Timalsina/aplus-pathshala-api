// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// require("dotenv").config();
// // const User = require("../models/userSchema");

// passport.use(
//     new GoogleStrategy(
//         {
//             // options for google strategy
//             clientID: process.env.CLIENT_ID,
//             clientSecret: process.env.CLIENT_SECRET,
//             // callbackURL:
//             //     "https://a-pathshala-service-2.onrender.com/auth/google/callback", //hosted uri:
//             callbackURL: "http://127.0.0.1:3000/auth/google/callback", //localhost uri
//             userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
//             scope: ["profile"],
//         },
//         (accessToken, refreshToken, profile, done) => {
//             // check if user already exists in our own db
//             User.findOne({
//                 email: profile.emails[0].value,
//             }).then((currentUser) => {
//                 if (currentUser) {
//                     // already have this user
//                     done(null, currentUser);
//                 } else {
//                     // Extract the user's information from the profile object
//                     const user = {
//                         name: profile.displayName,
//                         email: profile.emails[0].value,
//                         profilePicture: profile.photos[0].value,
//                         contact: profile.phoneNumbers
//                             ? profile.phoneNumbers[0].value
//                             : null,
//                     };
//                     // if not, create user in our db
//                     new User(user).save().then((newUser) => {
//                         done(null, newUser);
//                     });
//                 }
//             });
//         }
//     )
// );
