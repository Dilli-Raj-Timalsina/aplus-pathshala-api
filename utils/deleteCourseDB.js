const Course = require("./../models/courseSchema");

const deleteCourseDB = async (req, res, next) => {
    await Course.deleteMany({});
    res.status(204).json({
        status: "success",
        messgae: "all course deletd successfully",
    });
};
module.exports = deleteCourseDB;
