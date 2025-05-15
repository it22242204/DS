const express = require('express');
const router = express.Router(); 
const {createBanner, displayBanner} = require("../Controllers/BannerController");


router.post('/banner/create', createBanner );
router.get('/fetch/banner', displayBanner );




module.exports = router;