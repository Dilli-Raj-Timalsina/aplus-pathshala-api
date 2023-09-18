const router = require("express").Router();
const { searchItem } = require("./../controllers/searchController");

//ROUTES : 
router.route("/getItem/:id?").get(searchItem);

module.exports = router;
