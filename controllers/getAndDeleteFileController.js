const catchAsync = require("../errors/catchAsync");
const AppError = require("../errors/appError");
const Course = require("../models/courseSchema");
const s3 = require("../awsConfig/credential");

//It is used to give user the access to read object for certain time via secure link:
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
    ListObjectsV2Command,
    GetObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");

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
const ListAllFiles = catchAsync(async (req, res, next) => {
    const { bucketName, folderName } = req.body;
    const input = {
        Bucket: bucketName,
        Prefix: `${folderName}/`,
    };
    const command = new ListObjectsV2Command(input);
    const output = await s3.send(command);

    res.status(200).json({
        status: "sucess",
        ouput: output.Contents,
    });
});

//3:) delete an object of particular bucket/folder/object-key
const deleteFile = catchAsync(async (req, res, next) => {
    const { bucketName, folderName, keyName } = req.body;

    const input = {
        Bucket: bucketName,
        Key: `${folderName}/${keyName}`,
    };
    const command = new DeleteObjectCommand(input);
    await s3.send(command);
    res.end("successfully deleted file");
});

//
//
//

//4:) It deletes an entire folder from a bucket
const deleteEntireFolder = async (req, res, next) => {
    const { bucketName, folderName } = req.body;

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

    res.end("Folder deletion completed");
};

module.exports = {
    getFile,
    ListAllFiles,
    deleteFile,
    deleteEntireFolder,
};
