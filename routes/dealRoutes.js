const express = require("express");
const router = express.Router();
const dealscontrollers = require("../controllers/dealscontrollers");

router.post('/adddealscards', dealscontrollers.addDeals);
router.get('/dealscards', dealscontrollers.getDeals);

module.exports = router;