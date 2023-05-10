const router = require("express").Router();
const passport = require("passport");
const { signToken } = require("../controllers/studentAuthController");

router.get(
    "/auth/google",
    passport.authenticate("google", {
        session: false,
        scope: ["email", "profile"],
    })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://127.0.0.1:3000/failed",
        session: false,
    }),
    async (req, res) => {
        //generating token and setting it in cookie
        const token = await signToken({
            email: req.user.email,
            _id: req.user._id,
        });
        const cookieOptions = {
            expires: new Date(
                Date.now() +
                    process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };
        if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
        //setting cookie
        res.cookie("jwt", token, cookieOptions);
        //setting profile information
        res.user = {
            token: "Bearer " + token,
            name: req.user.name,
            email: req.user.email,
            profilePicture: req.user.profilePicture,
            contactNumber: req.user.contact,
        };
        //redirecting it to homepage
        res.redirect("https://a-pathshala-service-1.vercel.app/");
    }
);

module.exports = router;
