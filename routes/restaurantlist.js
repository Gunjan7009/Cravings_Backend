const express = require('express');
const router = express.Router();
const restaurantlistcontroller = require("../controllers/restaurantlistcontroller");

router.post("/restaurantlist", restaurantlistcontroller.createlistFile);
router.get("/restaurantlist", restaurantlistcontroller.getAlllist);
router.patch("/restaurantlist/:id", restaurantlistcontroller.updatelistFile);


module.exports = router;