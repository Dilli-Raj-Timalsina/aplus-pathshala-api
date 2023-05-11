const router = require("express").Router();
const upload = require("./../awsConfig/multerSetup"); // Multer setup for file uploads

//requiring all controller functions:
const {
    editFolder,
    uploadChapter,
    createNewCourse,
} = require("../controllers/createCourseController");
const { deleteEntireFolder } = require("../controllers/deleteCourseController");
const {
    getAllCourses,
    getCourseMetaData,
    getFile,
} = require("../controllers/getCourseController");
const deleteCourseDB = require("./../utils/deleteCourseDB");
const { protect } = require("../controllers/studentAuthController");

// Routes for creating courses :
router.route("/editFolder").post(protect, editFolder);
router
    .route("/uploadFolder")
    .post(protect, upload.array("binary", 15), uploadChapter);
router
    .route("/createCourse")
    .post(protect, upload.single("binary"), createNewCourse);

// Routes for getting courses
router.route("/getFile").post(protect, getFile);
router.route("/getAllCourses").get(protect, getAllCourses);
router.route("/getCourseMetaData").post(protect, getCourseMetaData);

// Routes for deleting courses
router.route("/deleteFolder").post(deleteEntireFolder);
router.route("/deleteCourse").get(deleteCourseDB);

module.exports = router;
