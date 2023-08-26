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
    getAllChapters,
} = require("../controllers/getCourseController");
const {
    generalProtect,
    protectTeacher,
} = require("../controllers/userAuthController");

// Routes for creating courses : only for role:"teacher"
// router.route("/editFolder").post(generalProtect, editFolder);
router
    .route("/uploadChapter")
    .post(
        generalProtect,
        protectTeacher,
        upload.array("binary", 15),
        uploadChapter
    );
router
    .route("/createCourse")
    .post(
        generalProtect,
        protectTeacher,
        upload.single("binary"),
        createNewCourse
    );

// Routes for getting courses
router.route("/getFile").post(generalProtect, getFile);
router.route("/getAllCourses").get(getAllCourses);
router.route("/getCourseMetaData").post(getCourseMetaData);
router.route("/getAllChapters").get(getAllChapters);

// Routes for deleting courses

// router.route("/deleteFolder").post(deleteEntireFolder);
// router.route("/deleteCourseAWS").get(deleteAllBucketAtOnce);

module.exports = router;
