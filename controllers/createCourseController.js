const catchAsync = require("../errors/catchAsync");
const AppError = require("../errors/appError");

const s3 = require("../awsConfig/credential");
const prisma = require("./../prisma/prismaClientExport");

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { createBucket } = require("../awsConfig/bucketControl");

const returnInputAccMimetype = (file, body, key) => {
    const { bucketName } = body;
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
// const doesExist = async (bucketName, folderName) => {
//     return !!(await Course.findOne({
//         bucketName: bucketName,
//         "content.folderName": folderName,
//     }));
// };
// const doesExist = async (bucketName, folderName) => {
//     return !!(await prisma.course.findFirst({
//         where: {
//             bucketName: bucketName,
//             include: {
//                 content: {
//                     where: {
//                         folderName: folderName,
//                     },
//                 },
//             },
//         },
//     }));
// };
//0:) Add remaining files to the folder:

//2:) Uploads multiple files to the specified folder in the corresponding bucket/course
const uploadChapter = catchAsync(async (req, res, next) => {
    //database work:
    //extract all data field related to folder/folderSchema
    let { folderName, folderTitle, free } = req.body;
    console.log("-----------------------------------------------------");

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

    const createdFolder = await prisma.folder.create({
        data: {
            folderName: folderName,
            folderTitle: folderTitle,
            videoTitles: videoTitles,
            isFree: isFree,
            pdfFileTitles: pdfFileTitles,
            videoLinks: videoLinks,
            pdfLinks: pdfLinks,
        },
    });

    await prisma.course.update({
        where: { id: "64defe7746f1f065b717adbb" },
        data: {
            content: {
                connect: { id: createdFolder.id },
            },
        },
    });

    //cloud work:
    //     let i = 0,
    //         j = 0;
    //     const inputs = req.files.map((file) => {
    //         if (file.mimetype == "video/mp4") {
    //             i++;
    //             return returnInputAccMimetype(
    //                 file,
    //                 req.body,
    //                 videoLinks[i - 1]
    //             );
    //         } else {
    //             j++;
    //             return returnInputAccMimetype(file, req.body, pdfLinks[j - 1]);
    //         }
    //     });

    //     //upload all files
    //     await Promise.all(
    //         inputs.map((input) => s3.send(new PutObjectCommand(input)))
    //     );
    //     res.status(200).json({
    //         status: "Success",
    //         message: "Successfully added new Folder",
    //     });
    // } else {
    //     throw new AppError(
    //         "Chapter Already Exist, please create another or editFolder",
    //         407
    //     );

    res.status(200).json({
        status: "Success",
        message: "Successfully added new Folder",
    });
    // }
});

//3:) create brand new course:
const createNewCourse = catchAsync(async (req, res, next) => {
    //database work:
    //create new course in database with thumbnail reference to s3
    const thumbNailKey = `${Date.now()}-${req.file.originalname}`;

    const teacherID = req.user.id;
    const doc = await prisma.course.create({
        data: {
            ...req.body,
            thumbNail: thumbNailKey,
        },
    });

    // connect userIds and CourseIds
    const op = await prisma.user.update({
        where: { id: teacherID },
        data: {
            courses: {
                connect: {
                    id: doc.id,
                },
            },
        },
    });

    // cloud work:
    // create a new course bucket
    // await createBucket({ Bucket: bucketName });

    // // upload thumbnail in s3
    // const command = new PutObjectCommand({
    //     Bucket: bucketName,
    //     Key: thumbnailKey,
    //     Body: req.file.buffer,
    // });
    // await s3.send(command);

    res.status(200).json({
        status: "success",
        doc,
        op,
    });
});

module.exports = {
    createNewCourse,

    uploadChapter,
};
