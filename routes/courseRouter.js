const router = require("express").Router();
const upload = require("./../awsConfig/multerSetup"); // Multer setup for file uploads

//requiring all controller functions:
const {
    // editFolder,
    uploadChapter,
    createNewCourse,
} = require("../controllers/createCourseController");
const { deleteEntireFolder } = require("../controllers/deleteCourseController");
const {
    getAllCourses,
    getCourseMetaData,
    getFile,
} = require("../controllers/getCourseController");
const {
    protectTeacher,
    generalProtect,
} = require("../controllers/userAuthController");

// Routes for creating courses : only for role:"teacher"
// router.route("/editFolder").post(generalProtect, editFolder);
router
    .route("/uploadFolder")
    .post(generalProtect, upload.array("binary", 15), uploadChapter);
router
    .route("/createCourse")
    .post(generalProtect, upload.single("binary"), createNewCourse);

// Routes for getting courses
router.route("/getFile").post(getFile);
router.route("/getAllCourses").get(getAllCourses);
router.route("/getCourseMetaData").post(getCourseMetaData);

// Routes for deleting courses
const deleteCourseDB = require("./../utils/deleteCourseDB");
const { deleteAllBucketAtOnce } = require("./../awsConfig/bucketControl");
router.route("/deleteFolder").post(deleteEntireFolder);
router.route("/deleteCourseDB").get(deleteCourseDB);
router.route("/deleteCourseAWS").get(deleteAllBucketAtOnce);

module.exports = router;
