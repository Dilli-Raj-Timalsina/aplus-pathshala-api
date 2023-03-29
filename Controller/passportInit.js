const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const Student = require("./../Model/studentSchema.js");
require("dotenv").config();

//options is an object literal containing options to control how the token is extracted from the request or verified.

function initialize() {
  let opts = {};
  //lets define options:
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.SECRET;
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      console.log(jwt_payload);
      Student.findOne({
        name: jwt_payload.id.name,
        passport: jwt_payload.id.passport,
      })
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            console.log(user);
            return done(null, false);
          }
        })
        .catch((err) => {
          console.log(err);
          return done(err, false);
        });
    })
  );
}
module.exports = initialize;
