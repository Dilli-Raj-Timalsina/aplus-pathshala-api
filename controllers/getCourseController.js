const catchAsync = require("../errors/catchAsync");
const AppError = require("../errors/appError");
const Course = require("../models/courseSchema");
const s3 = require("../awsConfig/credential");

//It is used to give user the access to read object for certain time via secure link:
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

//1:) get signed url of particular bucket-folder-key
const getFile = catchAsync(async (req, res, next) => {
    const { bucketName, folderName, keyName } = req.body;
    let input;

    if (keyName.split(".")[1] === "mp4") {
        input = {
            Bucket: bucketName,
            Key: `${folderName}/${keyName}`,
            ResponseContentType: "video/mp4",
        };
    } else {
        input = {
            Bucket: bucketName,
            Key: `${folderName}/${keyName}`,
        };
    }
    const command = new GetObjectCommand(input);
    const url = await getSignedUrl(s3, command, { expiresIn: 36000 });
    res.end(url);
});

//2:) list all objects from particular folder
const getFolderContent = catchAsync(async (req, res, next) => {
    const { bucketName } = req.body;
    const doc = await Course.findOne({
        bucketName: bucketName,
    }).select("content");

    res.status(200).json({
        status: "sucess",
        ouput: doc,
    });
});
//2:) get all the information about course
const getCourseMetaData = catchAsync(async (req, res, next) => {
    const { bucketName } = req.body;
    const doc = await Course.findOne({
        bucketName: bucketName,
    });

    res.status(200).json({
        status: "sucess",
        ouput: doc,
    });
});

module.exports = {
    getCourseMetaData,
    getFolderContent,
    getFile,
};
