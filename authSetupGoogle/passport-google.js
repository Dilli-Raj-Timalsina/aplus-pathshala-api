const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const prisma = require("./../prisma/prismaClientExport");

passport.use(
    new GoogleStrategy(
        {
            // options for google strategy
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,

            //     "https://a-pathshala-service-2.onrender.com/auth/google/callback",
            callbackURL: "http://127.0.0.1:3001/auth/google/callback",
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
            scope: ["profile"],
        },
        (accessToken, refreshToken, profile, done) => {
            // console.log(profile);
            // check if user already exists in our own db
            prisma.user
                .findFirst({
                    where: {
                        email: profile.emails[0].value,
                    },
                })
                .then((user) => {
                    if (user) {
                        // already have this user
                        done(null, user);
                    } else {
                        // Extract the user's information from the profile object
                        const user = {
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            profilePicture: profile.photos[0].value,
                        };
                        console.log(profile);
                        done(null, user);
                    }
                });
        }
    )
);
