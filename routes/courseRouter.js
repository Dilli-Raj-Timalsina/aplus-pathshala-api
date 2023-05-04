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

// Routes for creating courses
router.route("/editFolder").post(editFolder);
router.route("/uploadFolder").post(upload.array("binary", 12), uploadChapter);
router.route("/createCourse").post(upload.single("binary"), createNewCourse);

// Routes for getting courses
router.route("/getFile").post(getFile);
router.route("/getAllCourses").post(getAllCourses);
router.route("/getCourseMetaData").post(getCourseMetaData);

// Routes for deleting courses
router.route("/deleteFolder").post(deleteEntireFolder);

module.exports = router;
