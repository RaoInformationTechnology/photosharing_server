const messageModel = require('../model/message.model');
const postModel = require('../model/post.model');
const ObjectId = require('mongodb').ObjectId;

/**
 * @param {*} postData
 * Share post
 */
module.exports.sharedPost = (postData) => {
    return new Promise((resolve, reject) => {
        messageModel.find({ $and: [{ 'desId': postData.desId }, { 'srcId': postData.srcId }] }, function (err, foundUser) {
            if (err) {
                console.log('err=================>', err)
                reject({ status: 500, message: 'Internal Serevr Error' });
            } else if (foundUser.length > 0) {
                console.log("founduser=========================>", foundUser[0]);
                console.log("=============founduser post=================>", foundUser[0].postId);
                foundUser[0].postId.push(postId);
                foundUser[0].save();
                postModel.findOne({ _id: postData.postId }, function (err, foundPost) {
                    if (err) {
                        console.log('err=================>', err)
                        reject({ status: 500, message: 'Internal Serevr Error' });
                    } else {
                        console.log("=============founduser post=================>", foundPost);
                        console.log("=============founduser post sharecount=================>", foundPost.sharePostCount);
                        foundPost.sharePostCount++;
                        foundPost.save()
                    }
                    resolve({ status: 200, message: ' Post Shared', data: foundUser[0] });
                })
            } else {
                Post.save((err, post) => {
                    if (err) {
                        console.log('err=================>', err)
                        reject({ status: 500, message: 'Internal Serevr Error' });
                    } else {
                        console.log("posttt=============================>", post);
                        postModel.findOne({ _id: postData.postId }, function (err, foundPost) {
                            if (err) {
                                console.log('err=================>', err)
                                reject({ status: 500, message: 'Internal Serevr Error' });
                            } else {
                                console.log("=============founduser post=================>", foundPost);
                                console.log("=============founduser post sharecount=================>", foundPost.sharePostCount);
                                foundPost.sharePostCount++;
                                foundPost.save()
                            }
                            resolve({ status: 200, message: ' Post Shared', data: post });
                        })
                    }
                })
            }
        })
    })
}

/**
 * @param {*} curruntUserId
 * get user whose Shared post
 */
module.exports.getShardPost = (curruntUserId) => {
    return new Promise((resolve, reject) => {
        messageModel.aggregate([
            {
                $match: { 'desId': ObjectId(curruntUserId) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'srcId',
                    foreignField: '_id',
                    as: 'srcId'
                }
            },
            {
                $unwind: {
                    path: '$srcId',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    _id: 1,
                    postId: 1,
                    desId: 1,
                    srcId: {
                        _id: '$srcId._id',
                        userName: '$srcId.userName',
                        profilePhoto: '$srcId.profilePhoto'
                    }
                }
            }
        ])
            .exec((err, users) => {
                if (err) {
                    console.log("========================>", err);
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else {
                    console.log("response===========================>", users);
                    resolve({ status: 200, message: 'User Fetched whose Shared Post', data: users });
                }
            })
    })
}

/**
 * @param {*} _id
 * get Shared post
 */
module.exports.getPostsById = (id) => {
    return new Promise((resolve, reject) => {
        messageModel.aggregate([
            {
                $match: { '_id': ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'postId',
                    foreignField: '_id',
                    as: 'postId'
                }
            },
            {
                $unwind: {
                    path: '$postId',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'postId.userId',
                    foreignField: '_id',
                    as: 'postId.userId'
                }
            },
            {
                $unwind: {
                    path: '$postId.userId',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $group: {
                    _id: '$_id',
                    srcId: { $first: '$srcId' },
                    desId: { $first: '$desId' },
                    postId: { $push: '$postId' },
                }
            },
        ])
            .exec((err, posts) => {
                if (err) {
                    console.log("========================>", err);
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else {
                    console.log("response===========================>", posts[0]);
                    resolve({ status: 200, message: 'Shared Post Fetched', data: posts[0] });
                }
            })
    })
}