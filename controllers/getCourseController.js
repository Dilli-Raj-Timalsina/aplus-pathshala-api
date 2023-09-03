const catchAsync = require("../errors/catchAsync");
const AppError = require("../errors/appError");
const prisma = require("./../prisma/prismaClientExport");
const s3 = require("../awsConfig/credential");

//It is used to give user the access to read object for certain time via secure link:
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

//1:) get signed url of particular bucket-folder-key
const getFile = catchAsync(async (req, res, next) => {
    const bucketName = req.user.id;
    const { fileLink } = req.body;
    let input;

    if (fileLink.split(".")[1] === "mp4") {
        input = {
            Bucket: bucketName,
            Key: `${fileLink}`,
            ResponseContentType: "video/mp4",
        };
    } else {
        input = {
            Bucket: bucketName,
            Key: `${fileLink}`,
        };
    }
    const command = new GetObjectCommand(input);
    const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
    res.status(200).json({
        status: "sucess",
        ouput: url,
    });
});

//2:) get all the information about course
const getCourseMetaData = catchAsync(async (req, res, next) => {
    const courseId = req.params.id;
    const course = await prisma.course.findFirst({
        where: {
            id: courseId,
        },
    });
    if (!doc) {
        throw new AppError(
            "cannot find such course ,please try correct courseID",
            404
        );
    }

    res.status(200).json({
        status: "sucess",
        course,
    });
});

//3:) get all the  courses
const getAllCourses = catchAsync(async (req, res, next) => {
    //apply all filter criteria
    let courses, courseCount;
    const skipped = req.query.page ? req.query.page * 6 : 0;
    courseCount = await prisma.course.count({
        where: {
            category: req.params.id,
            reviewScore: { gte: req.query.rating * 1 },
            isFree: req.query.isFree == "true",
            duration: {
                gte: req.query.duration * 1,
                lte:
                    req.query.duration * 1 == 0 ? 1000 : req.query.duration * 2,
            },
        },
    });
    courses = await prisma.course.findMany({
        //apply pagination
        skip: skipped,
        take: 6,
        where: {
            category: req.params.id,
            reviewScore: { gte: req.query.rating * 1 },
            isFree: req.query.isFree == "true",
            duration: {
                gte: req.query.duration * 1,
                lte:
                    req.query.duration * 1 == 0 ? 1000 : req.query.duration * 2,
            },
        },
    });

    res.status(200).json({
        status: "sucess",
        courses,
        courseCount,
    });
});

const getAllChapters = catchAsync(async (req, res, next) => {
    //a:) find courseId from req.user
    const courseId = req.user.courseIds[0];
    //b:)get all chapter related to courseId,
    const allChapter = await prisma.chapter.findMany({
        where: {
            courseId: courseId,
        },
    });
    res.status(200).json({
        status: "success",
        allChapter,
    });
});

const getPopularCourse = catchAsync(async (req, res, next) => {
    const course = await prisma.course.findMany({
        where: {
            reviewScore: { gte: 4 },
        },
    });
    res.status(200).json({
        status: "success",
        course,
    });
});
const getPurchasedCourse = catchAsync(async (req, res, next) => {
    const userId = req.user.Id;
    const doc = await prisma.course.findMany({
        where: {
            id: userId,
        },
    });
    res.status(200).json({
        status: "success",
        doc,
    });
});

module.exports = {
    getCourseMetaData,
    getAllCourses,
    getFile,
    getAllChapters,
    getPopularCourse,
    getPurchasedCourse,
};
