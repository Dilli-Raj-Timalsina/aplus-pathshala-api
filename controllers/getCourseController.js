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

    if (keyName.split(".")[1] === "mp4") {
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
    const url = await getSignedUrl(s3, command, { expiresIn: 36000 });
    res.status(200).json({
        status: "sucess",
        ouput: url,
    });
});

//2:) get all the information about course
const getCourseMetaData = catchAsync(async (req, res, next) => {
    const doc = await prisma.course.findFirst({
        where: {
            id: req.user.courseIds[0],
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
        doc,
    });
});

//3:) get all the  courses
const getAllCourses = catchAsync(async (req, res, next) => {
    //return all course accoding to pagination:
    const courses = await prisma.course.findMany();
    res.status(200).json({
        status: "sucess",
        courses,
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

module.exports = {
    getCourseMetaData,
    getAllCourses,
    getFile,
    getAllChapters,
};
