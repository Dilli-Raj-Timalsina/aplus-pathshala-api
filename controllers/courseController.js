const catchAsync = require("./../errors/catchAsync");

const {
    putObject,
    putObjects,
    getObject,
    listAllObject,
    deleteObject,
    deleteObjects,
} = require("./../awsConfig/objectControl");
const { existBucket, createBucket } = require("./../awsConfig/bucketControl");
const AppError = require("../errors/appError");

//upload the single file in corresponding chapter/folder of corresponding bucket/course:
const uploadSingleFile = catchAsync(async (req, res, next) => {
    const { bucketName, folderName } = req.body;
    const { mimetype } = req.file;

    // 1. Check if the specified bucket exists
    const isExist = (await existBucket({ Bucket: bucketName })).$metadata
        .httpStatusCode;
    if (!isExist) {
        return new AppError("Bucket/Course doesnot exist");
    }

    let input;
    // 2. Set the input parameters based on the mimetype of the file
    if (mimetype === "video/mp4") {
        input = {
            Bucket: bucketName,
            Key: `${folderName}/${Date.now()}-${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: "video/mp4",
            ContentDisposition: "inline",
            CacheControl: "max-age=3153600, public",
        };
    } else {
        input = {
            Bucket: bucketName,
            Key: `${folderName}/${Date.now()}-${req.file.originalname}`,
            Body: req.file.buffer,
        };
    }
    // 3. Upload the file to S3
    await putObject(input);

    // 4. Send response to client
    res.end("single upload succesfull");
});

//upload the multiple file in corresponding chapter/folder of corresponding bucket/course:
const uploadMultipleFile = catchAsync(async (req, res, next) => {
    const { bucketName, folderName } = req.body;

    const inputs = req.files.map((file) => {
        const { mimetype } = file;
        if (mimetype === "video/mp4") {
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
    });

    await putObjects(inputs);
    res.end("multiple upload sucessfull");
});

//get signed url of particular bucket-folder-key
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
    const url = await getObject(input);
    res.end(url);
});

//list all objects from particular folder
const ListAllFiles = catchAsync(async (req, res, next) => {
    const { bucketName, folderName } = req.body;
    const input = {
        Bucket: bucketName,
        Prefix: `${folderName}/`,
    };
    const allObjects = await listAllObject(input);

    res.status(200).json(allObjects);
});

//delete an object of particular bucket/folder/object-key
const deleteFile = catchAsync(async (req, res, next) => {
    const { bucketName, folderName, keyName } = req.body;

    const input = {
        Bucket: bucketName,
        Key: `${folderName}/${keyName}`,
    };
    await deleteObject(input);
    res.end("successfully deleted file");
});

//create brand new course:
const createNewCourse = catchAsync(async (req, res, next) => {
    const { bucketName, folderName } = req.body;
    //1: create a new bucket:
    const input = { Bucket: bucketName };
    await createBucket(input);

    //2: upload multiple file in course
    const inputs = req.files.map((file) => {
        const { mimetype } = file;
        if (mimetype === "video/mp4") {
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
    });

    await putObjects(inputs);
    res.end("New Course Successfully created");
});

const deleteEntireFolder = async (req, res, next) => {
    const { bucketName, folderName } = req.body;

    // 1:) get an array of keys
    const inputForKey = {
        Bucket: bucketName,
        Prefix: `${folderName}/`,
    };

    const keysArray = await listAllObject(inputForKey);

    // 2:) extract all key and make array of inputs
    const inputs = keysArray.map((keyfile) => {
        return {
            Key: keyfile.Key,
        };
    });

    //3:) now delete all keys based on array of inputs
    const params = {
        Bucket: bucketName,
        Delete: {
            Objects: inputs,
            Quiet: false,
        },
    };
    //4: deletion command executed
    await deleteObjects(params);

    res.status(200).json({
        message: `All objects in folder ${folderName} deleted successfully`,
    });
};

module.exports = {
    createNewCourse,
    uploadSingleFile,
    uploadMultipleFile,
    getFile,
    ListAllFiles,
    deleteFile,
    deleteEntireFolder,
};
