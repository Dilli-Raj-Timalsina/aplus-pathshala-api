const { getAllCourse } = require("./../controllers/courseController");
const { protect } = require("./../controllers/studentAuthController");
const router = require("express").Router();

router.use(protect);
router.route("/").get(getAllCourse);
// router.route("/:id")

module.exports = router;
