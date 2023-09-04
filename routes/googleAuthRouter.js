const router = require("express").Router();
const passport = require("passport");
const { signToken } = require("../controllers/userAuthController");

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
        failureRedirect: "https://www.apluspathshala.com/",
        session: false,
    }),
    async (req, res) => {
        const token = await signToken({
            email: req.user.email,
            id: req.user.id,
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

        res.redirect(`http://localhost:3000/OAuthRedirecting?token=${token}`);
    }
);

module.exports = router;
