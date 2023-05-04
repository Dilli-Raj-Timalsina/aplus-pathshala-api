const catchAsync = require("../errors/catchAsync");
const AppError = require("../errors/appError");
const Course = require("../models/courseSchema");
const s3 = require("../awsConfig/credential");

const {
    ListObjectsV2Command,
    DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");

//1:) delete an object of particular bucket/folder/object-key

//2:) It deletes an entire folder from a bucket
const deleteEntireFolder = async (req, res, next) => {
    const { bucketName, folderName } = req.body;
    //database work:
    const doc = await Course.findOneAndUpdate(
        {
            bucketName: bucketName,
            content: { $elemMatch: { folderName: folderName } },
        },
        {
            //It removes that content which has folderName="xyz"here folderName variable
            $pull: { content: { folderName: folderName } },
        },
        { new: true }
    );

    //cloud work:
    const input1 = {
        Bucket: bucketName,
        Prefix: `${folderName}/`,
    };
    //get an array of keys
    const command1 = new ListObjectsV2Command(input1);
    const keysArray = await s3.send(command1);
    //extract all key and make array of inputs
    const inputs = keysArray.Contents.map((keyfile) => {
        return {
            Key: keyfile.Key,
        };
    });
    // delete all keys based on array of inputs
    const params = {
        Bucket: bucketName,
        Delete: {
            Objects: inputs,
            Quiet: false,
        },
    };
    //deletion command executed
    const command2 = new DeleteObjectsCommand(params);
    await s3.send(command2);

    res.status(200).json({
        status: "sucess",
        message: "Folder deletion completed",
    });
};

module.exports = {
    deleteEntireFolder,
};
