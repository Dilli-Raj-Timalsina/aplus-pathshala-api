const router = require("express").Router();
const upload = require("./../awsConfig/multerSetup"); // Multer setup for file uploads
const {
    editFolder,
    uploadChapter,
    createNewCourse,
} = require("./../controllers/courseController");
const {
    getFile,
    ListAllFiles,
    deleteFile,
    deleteEntireFolder,
} = require("./../controllers/getAndDeleteFileController");

// Routes for creating courses
router.route("/editFolder").post(
    upload.single("binary"), // Middleware for processing single file uploads
    editFolder // Controller function for handling single file upload
);
router.route("/uploadFolder").post(
    upload.array("binary", 50), // Middleware for processing multiple file uploads (up to 50 files)
    uploadChapter // Controller function for handling multiple file uploads
);
router.route("/createCourse").post(
    upload.single("binary"), // Middleware for processing multiple file uploads (up to 50 files)
    createNewCourse // Controller function for creating a new course
);

// Routes for getting courses
router.route("/getFile").get(getFile); // Controller function for getting a file by filename
router.route("/listAllFiles").get(ListAllFiles); // Controller function for getting a list of all files in the bucket

// Routes for deleting courses
router.route("/deleteFile").post(deleteFile); // Controller function for deleting a file by filename
router.route("/deleteFolder").post(deleteEntireFolder); // Controller function for deleting an entire folder and its contents

module.exports = router;
