const express = require('express');
const router = express.Router();
const postController = require('./../controller/post.controller');
const postValidation = require('./../validation/postValidation');
const fileUpload = require('../middleware/fileUpload');
const withAuth = require('../middleware/withAuth');

/* GET users listing. */
router.post('/addpost',[fileUpload.upload('images')], postController.addPost);
router.post('/like', [postValidation.likePost], postController.likePost);
router.post('/search', postController.searchPost);
router.get('/get-all-post', postController.getAllPost);
router.get('/get-post-by-id/:userId', postController.getPostByUserId);
router.get('/get-my-friends-post/:userId', postController.getMyFriendsPost);
router.get('/get-post-by-post-id/:postId', postController.getPostBYPostId)
router.put('/updatepost/:postId', postController.updatePostById);
router.put('/delete-post-by-id/:postId', postController.deletePost);

module.exports = router;
