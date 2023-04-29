const catchAsync = require("./../errors/catchAsync");

const {
    putObject,
    putObjects,
    getObject,
    listAllObject,
    deleteObject,
} = require("./../awsConfig/objectControl");

//upload the single file in corresponding chapter/folder of corresponding bucket/course:
const uploadSingleFile = catchAsync(async (req, res, next) => {
    // ContentEncoding metadata to 'gzip'
    //  which can be used to compress the video data before uploading it to S3.
    const { bucketName, folderName } = req.body;
    const { mimetype } = req.file;
    let input;
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
    await putObject(input);
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

const deleteFile = catchAsync(async (req, res, next) => {
    const { bucketName, folderName, keyName } = req.body;

    const input = {
        Bucket: bucketName,
        Key: `${folderName}/${keyName}`,
    };
    await deleteObject(input);
    res.end("successfully deleted file");
});

module.exports = {
    uploadSingleFile,
    uploadMultipleFile,
    getFile,
    ListAllFiles,
    deleteFile,
};
