const express = require('express');
const router = express.Router(); 
const {createCategory, getCategories} = require("../Controllers/CategoryController")


router.post('/category/create', createCategory );
router.get('/category/all', getCategories );



module.exports = router;