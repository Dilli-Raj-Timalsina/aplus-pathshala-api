const {
    uploadSingleFile,
    uploadMultipleFile,
    getFile,
    ListAllFiles,
    deleteFile,
    deleteEntireFolder,
} = require("./../controllers/courseController");

const upload = require("./../awsConfig/multerSetup");
const { createNewCourse } = require("../controllers/courseController");

const router = require("express").Router();

router.route("/upload-single").post(upload.single("file"), uploadSingleFile);
router
    .route("/upload-multiple")
    .post(upload.array("file", 50), uploadMultipleFile);
router.route("/get-single").get(getFile);
router.route("/getallfile").get(ListAllFiles);
router.route("/deletefile").post(deleteFile);
router.route("/deleteFolder").post(deleteEntireFolder);
router.route("/createCourse").post(upload.array("file", 50), createNewCourse);
module.exports = router;
