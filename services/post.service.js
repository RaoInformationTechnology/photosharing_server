const postModel = require('../model/post.model');
const userModel = require('../model/user.model');
const hashTagModel = require('../model/hashtag.model');
const ObjectId = require('mongodb').ObjectId;
const _ = require('lodash');
/**
 * @param {*} postData
 * Add Post
 */
module.exports.addPost = (postData,file) =>{
    console.log("=======", postData);
    return new Promise((resolve, reject) => {
        const Post = new postModel(postData);
        Post.save((err, post) => {
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' });
            } else {
                console.log("file", file);
                console.log("============postData===============>", typeof postData, postData);
                let hashTag = JSON.parse(postData.hashTag);
                console.log('hashtags===================>', hashTag);
                _.forEach(hashTag, function (tag) {
                    console.log('tag===============>', tag);
                    hashTagModel.findOne({ hashTag: tag })
                        .exec((err, foundTag) => {
                            if (err) {
                                reject({ status: 500, message: 'Internal Serevr Error' });
                                console.log('err------------------>', err);
                            } else if (foundTag) {
                                console.log('foundTag===============>', foundTag);
                                foundTag.count++;
                                foundTag.save();
                            } else {
                                console.log("==================not found======================")
                                let data = {
                                    hashTag: tag,
                                    count: 1
                                }
                                let hashnew = new hashTagModel(data);
                                hashnew.save();
                            }
                        })
                })
                postData.images = file.filename;
                postModel.findOneAndUpdate({ _id: post._id }, { $set: postData }, { upsert: true, new: true }).exec((error, post) => {
                    if (error) {
                        reject({ status: 500, message: 'Internal Serevr Error' });
                    } else {
                        console.log("post==============================>", post);
                        resolve({ status: 200, message: ' Post Added Successfully', data: post });
                    }
                })
            }
        })
    })
}

/**
 * @param {*} _pageNumber,offset
 * Get All Posts
 */
module.exports.getAllPost = (offset, _pageSize) => {
    console.log("=======", offset)
    return new Promise((resolve, reject) => {
        postModel.aggregate([
            { $match: { 'isDelete': false } },
            {
                $project: {
                    _id: '$_id',
                    images: 1,
                    created_date: 1
                }
            },
            { '$sort': { 'created_date': -1 } },
            { $skip: ((offset - 1) * _pageSize) },
            { $limit: _pageSize },
        ])
            .exec((err, posts) => {
                if (err) {
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else {
                    console.log('all post====================>', posts.length)
                    resolve({ status: 200, message: 'All Post Fetched', data: posts });
                }
            })
    })
}

/**
 * @param {*} userId
 * get pists by user id
 */
module.exports.getPostByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        console.log("userId============>",userId)
        userModel.aggregate([
            { $match: { '_id': ObjectId(userId) } },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'post'
                }
            },
            { $unwind: '$post' },
            { $match: { "post.isDelete": false } },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    friends: { $first: '$friends' },
                    followers: { $first: '$followers' },
                    userName: { $first: '$userName' },
                    email: { $first: '$email' },
                    password: {
                        $first: '$password'
                    },
                    profilePhoto: { $first: '$profilePhoto' },
                    post: {
                        $push: '$post',
                    },
                }
            },
        ])
            .exec((err, post) => {
                if (err) {
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else {
                    console.log('post===========================>', post);
                    resolve({ status: 200, message: ' Post Fetched', data: post[0] });
                }
            })
    })
}
/**
 * @param {*} postId,hashtag
 * update post by id
 */
module.exports.updatePostById = (postId, data) => {
    return new Promise((resolve, reject) => {
        _.forEach(data.hashTag, function (tag) {
            console.log('tag===============>', tag);
            hashTagModel.findOne({ hashTag: tag })
                .exec((err, foundTag) => {
                    if (err) {
                        reject({ status: 500, message: 'Internal Serevr Error' });
                        console.log('err------------------>', err);
                    } else if (foundTag) {
                        console.log('foundTag===============>', foundTag);
                        foundTag.count++;
                        foundTag.save();

                    } else {
                        console.log("==================not found======================")
                        let data = {
                            hashTag: tag,
                            count: 1
                        }
                        let hashnew = new hashTagModel(data);
                        hashnew.save();
                    }
                })
        })
        postModel.findOneAndUpdate({ _id: postId }, data, { upsert: true }, function (err, post) {
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' });
            } else {
                console.log('post======================>', post);
                resolve({ status: 200, message: 'Post Upadate successfully', data: post });
            }
        });
    })
}

/**
 * @param {*} postId
 * Get Post by POstId
 */
module.exports.getPostBYPostId = (postId) => {
    return new Promise((resolve, reject) => {
        postModel.aggregate([
            {
                $match: { '_id': ObjectId(postId) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'
                }
            },
            {
                $unwind: {
                    path: '$userId',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'comment',
                    foreignField: '_id',
                    as: 'comment'
                }
            },
            {
                $unwind: {
                    path: '$comment',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'comment.userId',
                    foreignField: '_id',
                    as: 'comment.userId'
                }
            },
            {
                $unwind: {
                    path: '$comment.userId',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    like: { $first: '$like' },
                    comment: { $push: '$comment' },
                    content: { $first: '$content' },
                    created_date: { $first: '$created_date' },
                    isLiked: { $first: '$isLiked' },
                    images: { $first: '$images' },
                }
            },
        ]).exec((err, post) => {
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' });
            } else {
                console.log('post========================>', post);
                resolve({ status: 200, message: 'Post Fetched', data: post });
            }
        })
    })
}
/**
 * @param {*} postId
 * Delete POst
 */
module.exports.deletePost = (postId) => {
    return new Promise((resolve, reject) => {
        postModel.findOneAndUpdate({ _id: postId }, { $set: { isDelete: true } }, { upsert: true, new: true }, function (err, post) {
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' });
            } else {
                console.log('post============>', post);
                resolve({ status: 200, message: 'Post Deleted Successfully', data: post });
            }
        })
    })
}

/**
 * @param {*} userId
 * get Friends Post
 */
module.exports.getMyFriendsPost = (userId) => {
    return new Promise((resolve, reject) => {
        userModel.aggregate([
            {
                $match: { '_id': ObjectId(userId) }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'friends',
                    foreignField: 'userId',
                    as: 'post'
                }
            },
            {
                $unwind: {
                    path: '$post',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'post.userId',
                    foreignField: '_id',
                    as: 'post.userId'
                }
            },
            {
                $unwind: {
                    path: '$post.userId',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $unwind: {
                    path: '$post.comment',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'post.comment',
                    foreignField: '_id',
                    as: 'post.comment'
                }
            },
            {
                $unwind: {
                    path: '$post.comment',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'post.comment.userId',
                    foreignField: '_id',
                    as: 'post.comment.userId'
                }
            },
            {
                $unwind: {
                    path: '$post.comment.userId',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $group: {
                    _id: '$post._id',
                    userId: { $first: '$_id' },
                    name: { $first: '$name' },
                    friends: { $first: '$friends' },
                    followers: { $first: '$followers' },
                    userName: { $first: '$userName' },
                    email: { $first: '$email' },
                    profilePhoto: { $first: '$profilePhoto' },
                    comment: { $push: '$post.comment' },
                    friendsPost: { $first: '$post' },
                }
            },
            { $sort: { 'friendsPost.created_date': -1 } },
            {
                $project: {
                    _id: '$userId',
                    name: 1,
                    friends: 1,
                    followers: 1,
                    userName: 1,
                    profilePhoto: 1,
                    email: 1,
                    friendsPost: {
                        _id: '$friendsPost._id',
                        userId: '$friendsPost.userId',
                        like: '$friendsPost.like',
                        isLiked: '$friendsPost.isLiked',
                        comment: '$comment',
                        content: '$friendsPost.content',
                        created_date: '$friendsPost.created_date',
                        images: '$friendsPost.images',
                        sharePostCount: '$friendsPost.sharePostCount'
                    }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    friends: { $first: '$friends' },
                    followers: { $first: '$followers' },
                    userName: { $first: '$userName' },
                    email: { $first: '$email' },
                    profilePhoto: { $first: '$profilePhoto' },
                    friendsPost: {
                        $push: '$friendsPost'
                    }
                }
            },
        ])
            .exec((err, post) => {
                if (err) {
                    reject({ status: 500, message: 'Internal Serevr Error' });
                    console.log('err: ', err);
                } else {
                    console.log('friends posts======================>', post);
                    resolve({ status: 200, message: 'Post Deleted Successfully', data: post[0] });
                }
            })
    })
}
/**
 * @param {*} userId,postId
 * Like Post
 */
module.exports.likePost = (userId, postId) => {
    return new Promise((resolve, reject) => {
        postModel.findOne({ _id: postId }) 
        .exec ((err, foundPost) =>{
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' });
            }
            const index = foundPost.like.indexOf(userId);
            console.log("index===========================//>", index);
            if (index != -1) {
                console.log("already liked");
                foundPost.like.splice(index, 1);
                foundPost.isLiked = false;
                foundPost.save();
                resolve({ status: 200, message: 'Liked Successfully', data: foundPost });

            } else {
                console.log('foundUser========================>', foundPost);
                foundPost.like.push(userId);
                foundPost.isLiked = true;
                foundPost.save();
                resolve({ status: 200, message: 'Liked Successfully', data: foundPost });
            }
        })
    })
}

/**
 * @param {*}key
 * Search Post
 */
module.exports.searchPost = (key) => {
    return new Promise((resolve, reject) => {
        postModel.aggregate([
            {
                $match: { $and: [{ 'content': { $regex: key, $options: 'i' } }, { 'isDelete': false }] }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'
                }
            },
            {
                $unwind: {
                    path: '$userId',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'comment',
                    foreignField: '_id',
                    as: 'comment'
                }
            },
            {
                $unwind: {
                    path: '$comment',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'comment.userId',
                    foreignField: '_id',
                    as: 'comment.userId'
                }
            },
            {
                $unwind: {
                    path: '$comment.userId',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    like: { $first: '$like' },
                    comment: { $push: '$comment' },
                    content: { $first: '$content' },
                    created_date: { $first: '$created_date' },
                    isLiked: { $first: '$isLiked' },
                    images: { $first: '$images' },
                }
            },
        ])
            .exec((err, foundPost) => {
                if (err) {
                    reject({ status: 500, message: 'Internal Serevr Error' });
                    console.log('err: ', err);
                } else {
                    console.log('friends posts======================>', foundPost);
                    resolve({ status: 200, message: 'Search post fetched', data: foundPost });
                }
            })
    })
}