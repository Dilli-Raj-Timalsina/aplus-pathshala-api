const catchAsync = require("../errors/catchAsync");
const AppError = require("../errors/appError");
const Course = require("../models/courseSchema");
const s3 = require("../awsConfig/credential");

//It is used to give user the access to read object for certain time via secure link:
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
    ListObjectsV2Command,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");

const { existBucket, createBucket } = require("../awsConfig/bucketControl");

//helper function:
//It return input command according to file type i.e mimetype
const returnInputAccMimetype = (file, body) => {
    const { bucketName, folderName } = body;
    const { mimetype } = file;

    if (mimetype == "video/mp4") {
        return {
            Bucket: bucketName,
            Key: `${folderName}/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: "video/mp4",
            ContentDisposition: "inline",
            CacheControl: "max-age=3153600, public",
        };
    } else {
        return {
            Bucket: bucketName,
            Key: `${folderName}/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
        };
    }
};

//
//
//
//
//1:) upload  single file in corresponding chapter/folder of corresponding bucket/course:
const uploadSingleFile = catchAsync(async (req, res, next) => {
    const { bucketName } = req.body;
    const { mimetype } = req.file;

    //  Check if the specified bucket exists
    const isExist =
        (await existBucket({ Bucket: bucketName })).$metadata.httpStatusCode !==
        "200";
    if (!isExist) {
        return new AppError("Bucket/Course doesnot exist");
    }

    //upload file to aws
    const input = returnInputAccMimetype(mimetype, req.file, req.body);
    const command = new PutObjectCommand(input);
    await s3.send(command);

    res.end("single file upload successfull");
});

//
//
//
//2:) Uploads multiple files to the specified folder in the corresponding bucket/course
const uploadMultipleFile = catchAsync(async (req, res, next) => {
    const inputs = req.files.map((file) => {
        return returnInputAccMimetype(file, req.body);
    });

    //upload all files
    await Promise.all(
        inputs.map((input) => s3.send(new PutObjectCommand(input)))
    );
    res.end("Multiple file upload successful");
});

//
//
//
//3:) get signed url of particular bucket-folder-key
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

//
//
//
//4:) list all objects from particular folder
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

//
//
//
//5:) delete an object of particular bucket/folder/object-key
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
//6:) create brand new course:
const createNewCourse = catchAsync(async (req, res, next) => {
    const { bucketName } = req.body;
    const thumbnailKey = `${bucketName}/${Date.now()}-${req.file.originalname}`;

    // create course in mongoDB and reference thumbnail to aws s3
    await Course.create({ ...req.body, thumbnail: thumbnailKey });

    // create a new course bucket
    await createBucket({ Bucket: bucketName });

    // upload thumbnail in s3
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: thumbnailKey,
        Body: req.file.buffer,
    });
    await s3.send(command);
    res.end("New Course Successfully created");
});

//
//
//
//7:) It deletes an entire folder from a bucket
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

//
//
//
//
module.exports = {
    createNewCourse,
    uploadSingleFile,
    uploadMultipleFile,
    getFile,
    ListAllFiles,
    deleteFile,
    deleteEntireFolder,
};
