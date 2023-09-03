const router = require("express").Router();
const {
    generalProtect,
    protectTeacher,
} = require("../controllers/userAuthController");

//Review Routes
const {
    writeReview,
    updateCart,
    getCartItems,
    getCartData,
    contactUs,
} = require("./../controllers/reviewController");
router.route("/writeReview").post(writeReview);
router.route("/getCart").get(generalProtect, getCartItems);
router.route("/updateCart").post(generalProtect, updateCart);
router.route("/getCartData").post(generalProtect, getCartData);
router.route("/contactUs").post(contactUs);
module.exports = router;
