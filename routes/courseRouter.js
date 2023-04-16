const { getAllCourse } = require("./../controllers/courseController");

const router = require("express").Router();

router.route("/").get(getAllCourse);

module.exports = router;
