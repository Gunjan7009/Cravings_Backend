const express = require('express');
const router = express.Router();
const popularfoodcontroller = require("../controllers/popularfoodcontroller");

router.post("/popularfood", popularfoodcontroller.createlistFile);
router.get("/popularfood", popularfoodcontroller.getAlllist);



module.exports = router;