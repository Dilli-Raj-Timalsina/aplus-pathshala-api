const catchAsync = require("./../errors/catchAsync");
const AppError = require("./../errors/appError");
const Course = require("./../models/courseSchema");

//

const uploadCourse = catchAsync(async (req, res, next) => {
    const results = await putObject(req.file);
    console.log(results);
    return res.json({ status: "success" });
});

const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.body;
    const updated = await Course.findByIdAndUpdate(
        id,
        { duration: "18" },
        { new: true }
    );
    res.end("updated");
});

const getAllCourse = catchAsync(async (req, res) => {
    console.log(req.user);
    res.end("all course");
});
const getCourse = catchAsync(async (req, res) => {});
const deleteCourse = catchAsync(async (req, res) => {});
app.post("/upload", upload.single("textfile"), async (req, res, next) => {
    const results = await putObject(req.file);
    console.log(results);
    return res.json({ status: "success" });
});

app.post("/multiUpload", upload.array("photos", 12), async (req, res, next) => {
    await putObjects(req.files);
    return res.json({ status: "success" });
});

module.exports = {
    getAllCourse,
    getCourse,
    uploadCourse,
    updateCourse,
    deleteCourse,
};
