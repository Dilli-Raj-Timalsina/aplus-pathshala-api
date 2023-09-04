const router = require("express").Router();
const upload = require("./../awsConfig/multerSetup"); // Multer setup for file uploads

// course upload route controller
const {
    uploadChapter,
    createNewCourse,
} = require("../controllers/createCourseController");

//course delete route controller
const { deleteEntireFolder } = require("../controllers/deleteCourseController");
const { deleteAllBucketAtOnce } = require("./../awsConfig/bucketControl");

//course consume/get route controller
const {
    getAllCourses,
    getCourseMetaData,
    getFile,
    getAllChapters,
    getPopularCourse,
    getPurchasedCourse,
} = require("../controllers/getCourseController");

//general authentication route controller
const {
    generalProtect,
    protectTeacher,
} = require("../controllers/userAuthController");

//course upload
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

// course download
router.route("/getFile").post(generalProtect, getFile);
router.route("/getAllCourses/:id?").get(getAllCourses);
router.route("/getCourseMetaData/:id?").get(getCourseMetaData);
router.route("/getAllChapters").get(getAllChapters);
router.route("/getPopularCourse").get(getPopularCourse);
router.route("/getPurchasedCourse").get(generalProtect, getPurchasedCourse);

// Routes for deleting courses
// router.route("/deleteFolder").post(deleteEntireFolder);
// router.route("/deleteCourseAWS").get(deleteAllBucketAtOnce);

module.exports = router;
