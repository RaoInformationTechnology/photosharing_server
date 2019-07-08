const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

/**
*@param {*} userData
* Register user Service
*/
module.exports.addUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName })
            .exec((err, foundUser) => {
                if (err) {
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else if (foundUser) {
                    console.log(foundUser)
                    reject({ status: 401, message: 'user is already exist' });
                } else {
                    User.create(userData,
                        function (err, user) {
                            if (err) {
                                console.log('errrrrrr=======>', err)
                                reject({ status: 500, message: ' There was a problem registering the user' });
                            } else {
                                console.log('user======================>', user)
                                resolve({ status: 200, message: 'registration sucessfully', data: user });
                            }
                        });
                }
            })
    })
}


/**
*@param {*} userId
*Get User By Id Service
*/
module.exports.getSingleUser = (userId) => {
    return new Promise((resolve, reject) => {
        User.findById({ _id: userId })
            .exec((err, user) => {
                if (err) {
                    reject({ status: 500, message: 'Internal Serevr Error' });
                }
                if (!user) {
                    resolve({ status: 400, message: 'User Not Found' });
                } else {
                    resolve({ status: 200, message: 'user data Fetched', data: user });
                }
            });
    })
}

/**
*@param {*} userData
*Update User Service
*/
module.exports.updateUser = (userData) => {
    console.log("{{{{{{{{{{{{{{{", userData)
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName })
            .exec((err, foundUser) => {
                if (err) {
                    console.log('err==================>', err);
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else if (!foundUser) {
                    User.findOneAndUpdate({ _id: userData.userId }, { $set: { userName: userData.userName } }, { upsert: true, new: true }, function (err, user) {
                        if (err) {
                            console.log('err================>', err)
                            reject({ status: 500, message: 'Internal Serevr Error' });
                        } else {
                            console.log('post======================>', user);
                            console.log("req.file", userData.file);
                            if (userData.file) {
                                userData.profilePhoto = userData.fileName;
                            } else {
                                userData.profilePhoto = user.profilePhoto
                            }
                            User.findOneAndUpdate({ _id: userData.userId }, { $set: { userName: userData.userName, profilePhoto: userData.profilePhoto } }, { upsert: true, new: true }, function (err, post) {
                                if (err) {
                                    reject({ status: 500, message: 'Internal Serevr Error' });
                                } else {
                                    console.log("post========================>", post);
                                    resolve({ status: 200, message: 'user data Fetched', data: post });
                                    // res.status(200).send(post)
                                }
                            })

                        }
                    })
                }
                else {
                    console.log('foundUser==================>', foundUser);
                    if (foundUser._id == userData.userId) {
                        console.log("======================");
                        User.findOneAndUpdate({ _id: userData.userId }, { $set: { userName: userData.userName } }, { upsert: true, new: true }, function (err, user) {
                            if (err) {
                                reject({ status: 500, message: 'Internal Serevr Error' });
                            } else {
                                console.log('post======================>', user);
                                console.log("req.file", userData.file);
                                if (userData.file) {
                                    userData.profilePhoto = userData.fileName;
                                } else {
                                    userData.profilePhoto = user.profilePhoto
                                }
                                User.findOneAndUpdate({ _id: userData.userId }, { $set: { userName: userData.userName, profilePhoto: userData.profilePhoto } }, { upsert: true, new: true }, function (err, post) {
                                    if (err) {
                                        reject({ status: 500, message: 'Internal Serevr Error' });
                                    } else {
                                        console.log("post========================>", post);
                                        resolve({ status: 200, message: 'user data Fetched', data: post });
                                    }
                                })
                            }
                        })

                    } else {
                        console.log("Try other UserName")
                        reject({ status: 409, message: 'Try other username.....' });
                        // res.status(409).send("Try other username.....")
                    }
                }
            })
    })

}

/**
*@param {*} userData
*get User's friends Service
*/
module.exports.getMyAllFriendsById = (userId) => {
    return new Promise((resolve, reject) => {
        User.findOne({ _id: userId })
            .exec((err, result) => {
                if (err) {
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else {
                    User.find({ '_id': { $in: result.friends } })
                        .exec((err, friend) => {
                            if (err) {
                                reject({ status: 500, message: 'Internal Serevr Error' });
                            } else {
                                console.log("==========&%^$&$$%^$%^%&^%$^", friend);
                                resolve({ status: 200, message: "user's friends...", data: friend });
                            }
                        })
                }
            })
    })
}

/**
*@param {*} userData
*get User's followers Service
*/
module.exports.getMyFollowersById = (userId) => {
    return new Promise((resolve, reject) => {
        User.findOne({ _id: userId })
            .exec((err, foundUser) => {
                if (err) {
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else {
                    User.find({ '_id': { $in: foundUser.followers } })
                        .exec((err, followers) => {
                            if (err) {
                                reject({ status: 500, message: 'Internal Serevr Error' });
                            } else {
                                console.log('followers================>', followers);
                                resolve({ status: 200, message: "user's followers...", data: followers });
                            }
                        })
                }
            })
    })
}

/**
*@param {object} userData
* user login
*/
module.exports.login = (userData) => {
    return new Promise((resolve, reject) => {
        console.log("[[[[[[[[[[", userData)
        User.findOne({ userName: userData.userName }, function (err, user) {
            console.log("userrrrrrr", user);
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' });
            } else if (!user) {
                reject({ status: 404, message: 'No user found' });
            } else {
                console.log('compare passowrd: ', userData.password, user.password);
                const passwordIsValid = bcrypt.compare(userData.password, user.password);
                console.log('Hello Komal', passwordIsValid);
                if (!passwordIsValid) {
                    reject({ status: 401, message: "password is not valid", auth: false, token: null });
                }
                const token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400
                });
                console.log('token=============>', token);
                resolve({ status: 200, message: "login successfull", data: user, auth: true, token: token });
            }
        });
    })
}
/**
 * Get All user 
 */
module.exports.getAllUser = () => {
    return new Promise((resolve, reject) => {
        User.find({})
            .exec((err, users) => {
                if (err) {
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else if (users) {
                    console.log('users==================================>', users);
                    resolve({ status: 200, message: "Users data fetched", data: users });
                } else {
                    resolve({ status: 404, message: "Users not found" });
                }
            })
    })
}

/**
 * @param {*} userId
 * Delete user by id
 */
module.exports.deleteUserById = (userId) => {
    return new Promise((resolve, reject) => {
        User.findOneAndDelete({ _id: userId }).exec((err, user) => {
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' });
            } else {
                console.log(user);
                resolve({ status: 200, message: "User deleted", data: user });
            }
        })
    })
}

/**
 * @param {*} userData
 * check user is present or not if not present than create user
 */
module.exports.checkAvailability = (userData) => {
    return new Promise((resolve, reject) => {
        User.findOne({ facebookId: userData.id }, function (err, user) {
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' });
            }
            if (user) {
                console.log('user========*************========>', user);
                resolve({ status: 200, message: "User is already exist", data: user });
            } else {
                User.create({
                    facebookId: userData.id,
                    token: userData.accessToken,
                    name: userData.name,
                },
                    function (err, user) {
                        if (err) {
                            reject({ status: 500, message: 'There was a problem registering the user' });
                        } else {
                            console.log('user======================>', user)
                            resolve({ status: 200, message: "User register successfully", data: user });
                        }
                    });
            }
        })
    })
}

/**
 * @param {*} key
 * Search user
 */
module.exports.searchUser = (key) => {
    return new Promise((resolve, reject) => {
        User.find({ userName: { $regex: key, $options: 'i' } }, function (err, foundUser) {
            if (err) {
                console.log('==============err============', err)
                reject({ status: 500, message: 'Internal Serevr Error' });
            } else {
                console.log('res===================>', foundUser)
                resolve({ status: 200, message: "User searched..", data: foundUser });
            }
        })
    })
}
/**
 * @param {*} requestedUser,userTobeFollowed
 * Follow User
 */
module.exports.addFriend = (requestedUser, userTobeFollowed) => {
    return new Promise((resolve, reject) => {
        User.findOne({ _id: requestedUser }, function (err, foundUser) {
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' });
            }
            console.log("foundUser==================>", foundUser);
            const index = foundUser.friends.indexOf(userTobeFollowed);
            console.log('index===================>', index);
            if (index != -1) {
                resolve({ status: 200, message: "you already follow" });
            }
            else {
                console.log('user==============>', userTobeFollowed);
                console.log("foundeuser===============>", foundUser);
                foundUser.friends.push(userTobeFollowed);
                foundUser.save();
                User.findOne({ _id: userTobeFollowed }, function (err, user) {
                    if (err) {
                        reject({ status: 500, message: 'Internal Serevr Error' });
                    }
                    const index = foundUser.friends.indexOf(requestedUser);
                    console.log('index===================>', index);
                    if (index != -1) {
                        resolve({ status: 200, message: "you already follow" });
                    } else {
                        console.log('user found------------------------------->', user);
                        user.followers.push(requestedUser);
                        user.save();
                        resolve({ status: 200, message: "Follow successfully", data: foundUser });
                    }
                })
            }
        })
    })
}

/**
 * @param {*} requestedUser,userTobeUnFollowed
 * Follow User
 */
module.exports.removeFriend = (requestedUser, userTobeUnFollowed) => {
    return new Promise((resolve, reject) => {
        console.log("data=============>", requestedUser, userTobeUnFollowed)
        User.findOne({ _id: requestedUser }, function (err, foundUser) {
            console.log("foundUser==========>", foundUser);
            const index = foundUser.friends.indexOf(userTobeUnFollowed);
            console.log(index);
            if (index == -1) {
                console.log("user not found");
                reject({ status: 401, message: 'Bad Request' });
            }
            else {
                foundUser.friends.splice(index, 1);
                foundUser.save();
                User.findOne({ _id: userTobeUnFollowed }, function (err, user) {
                    if (err) {
                        reject({ status: 500, message: 'Internal Serevr Error' });
                    }
                    const index = foundUser.friends.indexOf(requestedUser);
                    console.log('index===================>', index);
                    if (index != -1) {
                        res.status(200).send("you already unfollow ")
                        resolve({ status: 200, message: "you already unfollow" });
                    }
                    else {
                        console.log('user found------------------------------->', user);
                        user.followers.splice(index, 1);
                        user.save();
                        resolve({ status: 200, message: "Unfollow successfully", data: foundUser });
                    }
                })
            }
        })
    })
}