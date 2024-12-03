const express = require("express");
const router = express.Router();
const offercontrollers = require("../controllers/offercontrollers");

router.post('/addoffercards', offercontrollers.addOffers);
router.get('/offercards', offercontrollers.getOffers);

module.exports = router;