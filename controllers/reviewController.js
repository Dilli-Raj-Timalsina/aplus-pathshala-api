const Course = require("./../models/courseSchema");
const Review = require("./../models/reviewSchema");

const writeReview = async (req, res, next) => {

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
};
module.exports = { writeReview };
