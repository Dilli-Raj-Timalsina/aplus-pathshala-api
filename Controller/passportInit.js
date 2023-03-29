const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const Student = require("./../Model/studentSchema.js");

//options is an object literal containing options to control how the token is extracted from the request or verified.

function initialize(passport) {
  let opts = {};
  //lets define options:
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  // console.log(process.env);
  // console.log(process.env.SECRET);
  opts.secretOrKeyProvider = "thisismysecretjwtkey";
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      console.log(jwt_payload);
      //   Student.findOne({ id: jwt_payload.sub }, function (err, user) {
      //     console.log(id);
      //     if (err) {
      //       return done(err, false);
      //     }
      //     if (user) {
      //       return done(null, user);
      //     } else {
      //       return done(null, false);
      //       // or you could create a new account
      //     }
      //   });
    })
  );
}
module.exports = initialize;
