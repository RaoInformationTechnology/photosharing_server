const express = require('express');
const router = express.Router();
const hashTagController = require('./../controller/hashTag.controller');
const withAuth = require('../middleware/withAuth');

router.post('/addtag', hashTagController.addTag);
router.get('/gettag', hashTagController.getTag);

module.exports = router;