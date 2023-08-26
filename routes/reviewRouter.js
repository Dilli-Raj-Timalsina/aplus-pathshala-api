const router = require("express").Router();

//Review Routes
const {
    writeReview,
    updateCart,
    getCartItems,
} = require("./../controllers/reviewController");
router.route("/writeReview").post(writeReview);
router.route("/getCart").get(getCartItems);
router.route("/updateCart").post(updateCart);
module.exports = router;
