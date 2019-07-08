const express = require('express');
const router = express.Router();
const messageController = require('./../controller/message.controller');
const withAuth = require('../middleware/withAuth');

router.post('/sharepost', messageController.sharedPost);
router.get('/get-shared-post/:curruntUserId', messageController.getShardPost);
router.get('/get-shared-post-by-id/:id',  messageController.getPostsById);

module.exports = router;