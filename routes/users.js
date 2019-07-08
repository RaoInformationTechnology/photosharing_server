const express = require('express');
const router = express.Router();
const userController = require('./../controller/user.controller');
const userValidation = require('./../validation/userValidation');
const fileUpload = require('../middleware/fileUpload');
const withAuth = require('../middleware/withAuth');

router.post('/signup', [userValidation.addUser], userController.addUser);
router.post('/login', userController.login);
router.post('/facebooklogin', userController.checkAvailability);
router.post('/follow', [userValidation.follow], userController.addFriend);
router.post('/unfollow', [userValidation.unfollow], userController.removeFriend);
router.post('/search', userController.searchUser);
// router.post('/auth/facebook',userController.facebook);
// router.post('/auth/facebook', userController.passport.authenticate('facebook', {scope: ['email']}));
router.get('/get-single-user/:userId', userController.getSingleUser);
router.get('/get-all-user', userController.getAllUser);
router.get('/get-my-friends/:userId', userController.getMyAllFriendsById);
router.get('/get-my-followers/:userId', userController.getMyFollowersById);
router.put('/update-user/:userId/:userName',[fileUpload.upload('profilePhoto')], userController.updateUser);
router.delete('/delet-user/:userId', userController.deleteUserById)

module.exports = router;
