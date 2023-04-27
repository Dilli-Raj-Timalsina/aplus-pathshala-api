const {
    getAllCourse,
    createCourse,
    updateCourse,
    deleteCourse,
} = require("./../controllers/courseController");
const { protect } = require("./../controllers/teacherAuthController");
const router = require("express").Router();

// router.use(protect);
router.route("/upload").post(createCourse);
// router.route("/update").post(updateCourse);
// router.route("/delete").post(deleteCourse);
// router.route("/:id")

module.exports = router;
