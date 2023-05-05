const Course = require("./../models/courseSchema");
const Review = require("./../models/reviewSchema");
const AppError = require("./../errors/appError");
const catchAsync = require("./../errors/catchAsync");
const writeReview = catchAsync(async (req, res, next) => {
    throw new AppError("This is wrong bro");
    const { bucketName } = req.body;
    const review = {
        rating: "5",
        comment: "Thi is comment",
    };

    const doc = await Course.findOneAndUpdate(
        {
            bucketName: bucketName,
        },
        {
            $push: {
                review: review,
            },
        }
    );

    res.end("review successful");
});

const editReview = async (req, res, next) => {
    const { bucketName } = req.body;
    const review = {
        rating: "5",
        comment: "Thi is comment",
        updatedAt: Date.now(),
    };

    const doc = await Course.findOneAndUpdate(
        {
            bucketName: bucketName,
        },
        {
            $push: {
                review: review,
            },
        }
    );

    res.end("review successful");
};
module.exports = { writeReview };
