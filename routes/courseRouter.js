const router = require("express").Router();
const upload = require("./../awsConfig/multerSetup"); // Multer setup for file uploads

//requiring all controller functions:
const {
    // editFolder,
    uploadChapter,
    createNewCourse,
} = require("../controllers/createCourseController");
const { deleteEntireFolder } = require("../controllers/deleteCourseController");
const { deleteAllBucketAtOnce } = require("./../awsConfig/bucketControl");
const {
    getAllCourses,
    getCourseMetaData,
    getFile,
} = require("../controllers/getCourseController");
const { generalProtect } = require("../controllers/userAuthController");

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

// router.route("/deleteFolder").post(deleteEntireFolder);
// router.route("/deleteCourseAWS").get(deleteAllBucketAtOnce);

//Review Routes
const { writeReview } = require("./../controllers/reviewController");
router.route("/writeReview").post(writeReview);

module.exports = router;
