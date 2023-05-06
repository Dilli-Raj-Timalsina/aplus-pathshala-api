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
    "/auth/google/redirect",
    passport.authenticate("google", {
        failureRedirect: "/api/v1/student/signup",
        session: false,
    }),
    async (req, res) => {
        const token = await signToken(req.user.email);
        res.status(200).json({
            status: "success",
            token: "Bearer " + token,
            name: req.user.name,
            email: req.user.email,
            profilePicture: req.user.profilePicture,
            contactNumber: req.user.contact,
        });
    }
);

module.exports = router;
