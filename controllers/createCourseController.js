const catchAsync = require("../errors/catchAsync");
const AppError = require("../errors/appError");
const Course = require("../models/courseSchema");
const s3 = require("../awsConfig/credential");

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { createBucket } = require("../awsConfig/bucketControl");

const returnInputAccMimetype = (file, body, key) => {
    const { bucketName, folderName } = body;
    const { mimetype } = file;

    if (mimetype == "video/mp4") {
        return {
            Bucket: bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: "video/mp4",
            ContentDisposition: "inline",
            CacheControl: "max-age=3153600, public",
        };
    } else {
        return {
            Bucket: bucketName,
            Key: key,
            Body: file.buffer,
        };
    }
};

//return true if there is content with folderName exist
const doesExist = async (bucketName, folderName) => {
    return !!(await Course.findOne({
        bucketName: bucketName,
        "content.folderName": folderName,
    }));
};

//0:) Add remaining files to the folder:

//1:) Edit Folder title of provided bucketName/folderName
const editFolder = catchAsync(async (req, res, next) => {
    const { bucketName, folderName, folderTitle } = req.body;

    await Course.findOneAndUpdate(
        { bucketName: bucketName, "content.folderName": folderName },
        {
            $set: { "content.$.folderTitle": folderTitle },
        }
    );
    res.status(200).json({
        status: "Success",
        message: "Successfully edited Folder Title",
    });
});

//2:) Uploads multiple files to the specified folder in the corresponding bucket/course
const uploadChapter = catchAsync(async (req, res, next) => {
    //database work:
    //extract all data field related to folder/folderSchema
    let { bucketName, folderName, folderTitle, free } = req.body;

    let videoTitles = [];
    let pdfFileTitles = [];
    let videoLinks = [];
    let pdfLinks = [];
    let isFree = [];

    //extract and fill videotitle,videolinks,pdftitle, pdflink and isFree from req.files,
    //It helps to keep reference of s3 object in database for future query
    req.files.forEach((file) => {
        if (file.mimetype == "video/mp4") {
            //check if video is free or not
            if (free == true) {
                isFree.push(true);
            } else {
                isFree.push(false);
            }
            //add video titles
            videoTitles.push(file.originalname);
            //add video links/keys:
            videoLinks.push(`${folderName}/${Date.now()}-${file.originalname}`);
        } else {
            pdfFileTitles.push(file.originalname);
            pdfLinks.push(`${folderName}/${Date.now()}-${file.originalname}`);
        }
    });

    const newFolder = {
        folderName: folderName,
        folderTitle: folderTitle,
        videoTitles: videoTitles,
        isFree: isFree,
        pdfFileTitles: pdfFileTitles,
        videoLinks: videoLinks,
        pdfLinks: pdfLinks,
    };

    if (!(await doesExist(bucketName, folderName))) {
        await Course.findOneAndUpdate(
            { bucketName: bucketName },
            {
                $push: { content: newFolder },
            },
            { new: true }
        );

        //cloud work:
        let i = 0,
            j = 0;
        const inputs = req.files.map((file) => {
            if (file.mimetype == "video/mp4") {
                i++;
                return returnInputAccMimetype(
                    file,
                    req.body,
                    videoLinks[i - 1]
                );
            } else {
                j++;
                return returnInputAccMimetype(file, req.body, pdfLinks[j - 1]);
            }
        });

        //upload all files
        await Promise.all(
            inputs.map((input) => s3.send(new PutObjectCommand(input)))
        );
        res.status(200).json({
            status: "Success",
            message: "Successfully added new Folder",
        });
    } else {
        res.status(400).json({
            status: "Failed",
            message: "Chapter Already Exist ,please create other or update",
        });
    }
});

//3:) create brand new course:
const createNewCourse = catchAsync(async (req, res, next) => {
    //database work:
    //create new course in database with thumbnail reference to s3
    const { bucketName } = req.body;
    console.log(req.body, req.file, req.files);
    const thumbnailKey = `${Date.now()}-${req.file.originalname}`;

    await Course.create({ ...req.body, thumbnail: thumbnailKey });

    // cloud work:
    // create a new course bucket
    await createBucket({ Bucket: bucketName });

    // upload thumbnail in s3
    // const command = new PutObjectCommand({
    //     Bucket: bucketName,
    //     Key: thumbnailKey,
    //     Body: req.file.buffer,
    // });
    // await s3.send(command);
    res.end("New Course Successfully created");
});

module.exports = {
    createNewCourse,
    editFolder,
    uploadChapter,
};
