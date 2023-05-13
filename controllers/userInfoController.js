const AppError = require("../errors/appError");
const catchAsync = require("../errors/catchAsync");

//1:) return all user profile information :
const profileControl = catchAsync(async (req, res, next) => {
    //extract all user Information:
    const { _id, name, email, course, profilePicture, contact } = req.user;
    //send required profile information:
    res.status(200).json({ _id, name, email, course, profilePicture, contact });
});

module.exports = {
    profileControl,
};
