// Multer is a node.js middleware for handling multipart/form-data
const multer = require("multer");
const AppError = require("../errors/appError");

// /*
// setup for Disk storage/to store on your current pc/machine

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "." + file.mimetype.split("/")[1];
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") {
        cb(null, true);
    } else {
        cb(new AppError("Only Image can be inserted"), false);
    }
};
const upload = multer({ dest: "./uploads" });
// */

//setup for cloud storage / to create a buffer
// const storage = multer.memoryStorage();

// const upload = multer({
//     storage,
//     // fileFilter,
//     // limits: { fileSize: 1000000000 },
// });

module.exports = upload;
