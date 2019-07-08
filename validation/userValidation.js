const Joi = require('joi');

module.exports.addUser = (req, res, next) => {
    const addUserchema = Joi.object().keys({
        name: Joi.string().required(),
        userName: Joi.string().required(),
        password: Joi.any().required(),
        email: Joi.string().required(),
    })
    Joi.validate(
        req.body,
        addUserchema,
        { convert: true },
        (err, value) => {
            if (err) {
                return res.status(400).json({
                    message: 'Bad request'
                });
            } else {
                next();
            }
        }
    );
}

// module.exports.login = (req,res,next) =>{
//     const loginUserchema = Joi.object().keys({
//         password:Joi.string().required(),
//         userName:Joi.string().required(),
//     })

//     Joi.validate(      
//         req.body,
//         loginUserchema,

//         { convert: true },
//         (err, value) => {
//             if (err) {
//                 return res.status(400).json({
//                     message: 'Bad request'
//                 });
//             } else {
//                 next();
//             }
//         }
//         );   
// }


module.exports.follow = (req, res, next) => {
    const followUserchema = Joi.object().keys({
        requestedUser: Joi.string().required(),
        userTobeFollowed: Joi.string().required(),
    })
    Joi.validate(
        req.body,
        followUserchema,
        { convert: true },
        (err, value) => {
            if (err) {
                return res.status(400).json({
                    message: 'Bad request'
                });
            } else {
                next();
            }
        }
    );
}

module.exports.unfollow = (req, res, next) => {
    const unfollowUserchema = Joi.object().keys({
        requestedUser: Joi.string().required(),
        userTobeUnFollowed: Joi.string().required(),
    })
    Joi.validate(
        req.body,
        unfollowUserchema,
        { convert: true },
        (err, value) => {
            if (err) {
                return res.status(400).json({
                    message: 'Bad request'
                });
            } else {
                next();
            }
        }
    );
}


