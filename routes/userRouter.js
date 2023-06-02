const router = require("express").Router();
const {
    signupControl,
    loginControl,
    forgetControl,
    resetControl,
    logoutControl,
    generalProtect,
    verifyControl,
} = require("../controllers/userAuthController");
const {
    profileControl,
    contactUsControl,
    verifyPaymentControl,
} = require("../controllers/userInfoController");
const upload = require("./../awsConfig/multerSetup"); // Multer setup for file uploads

// General Auth routes :
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);
router.route("/forgetPassword").post(forgetControl);
router.route("/verifyToken").post(verifyControl);
router.route("/resetPassword").post(resetControl);
router.route("/logout").get(generalProtect, logoutControl);
router
    .route("/verifyPayment")
    .post(generalProtect, upload.single("binary"), verifyPaymentControl);

//General Profile routes:
router.route("/profile").get(generalProtect, profileControl);
router.route("/contactUs").post(contactUsControl);

module.exports = router;
