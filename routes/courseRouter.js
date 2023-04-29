const {
    uploadSingleFile,
    uploadMultipleFile,
    getFile,
    ListAllFiles,
    deleteFile,
} = require("./../controllers/courseController");

const upload = require("./../awsConfig/multerSetup");

const router = require("express").Router();

router.route("/upload-single").post(upload.single("file"), uploadSingleFile);
router
    .route("/upload-multiple")
    .post(upload.array("file", 50), uploadMultipleFile);
router.route("/get-single").get(getFile);
router.route("/getallfile").get(ListAllFiles);
router.route("/deletefile").post(deleteFile);
module.exports = router;
