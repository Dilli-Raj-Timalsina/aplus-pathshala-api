const catchAsync = require("../errors/catchAsync");

//1:) return all user profile information :
const profileControl = catchAsync(async (req, res, next) => {
    const { id, name, email, profilePicture, contact } = req.user;

    res.status(200).json({
        id,
        name,
        email,
        profilePicture,
        contact,
    });
});

module.exports = {
    profileControl,
};
