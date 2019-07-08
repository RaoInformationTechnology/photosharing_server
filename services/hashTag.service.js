const hashTagModel = require('../model/hashtag.model');

/**
 * @param {*} hashTagData
 * add hashTag
 */
module.exports.addTag = (hashTag) => {
    return new Promise((resolve, reject) => {
        hashTagModel.findOne({ hashTag: hashTag })
            .exec((err, foundTag) => {
                if (err) {
                    reject({ status: 500, message: 'Internal Serevr Error' });
                    console.log('err------------------>', err);
                } else if (foundTag) {
                    console.log('foundTag===============>', foundTag);
                    foundTag.count++;
                    foundTag.save();
                    resolve({ status: 200, message: 'hashTag added sucessfully' });
                } else {
                    hashTag.save((err, tag) => {
                        if (err) {
                            reject({ status: 500, message: 'Internal Serevr Error' });
                            console.log('err------------------>', err);
                        } else {
                            console.log('hastag=================>', tag);
                            resolve({ status: 200, message: 'hashTag added sucessfully', data: tag });
                        }
                    })
                }
            })
    })
}

/**
 * get HashTag
 */
module.exports.getTag = () => {
    return new Promise((resolve, reject) => {
        hashTagModel.find({}, function (err, tag) {
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' });
                console.log('err------------------>', err);
            } else {
                console.log('all tag====================>', tag);
                resolve({ status: 200, message: 'hashTag  fetched', data: tag });
            }
        })
    })
}
