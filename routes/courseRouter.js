const {
  getAllCourse,
  createCourse,
  updateCourse,
} = require("./../controllers/courseController");
const { protect } = require("./../controllers/teacherAuthController");
const router = require("express").Router();

router.use(protect);
router.route("/").get(getAllCourse);
router.route("/create").post(createCourse);
router.route("/update").post(updateCourse);
// router.route("/:id")

module.exports = router;
