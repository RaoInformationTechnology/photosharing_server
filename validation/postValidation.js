const Joi = require('joi');


// module.exports.addPost = (req,res,next) =>{
// 	const addPostchema = Joi.object().keys({
// 		images: Joi.string().required(),
//         userId:Joi.string().required(),
//         content:Joi.string()

//     })

//     Joi.validate(      
//         req.body,
//         addPostchema,

//         { convert: true },
//         (err, value) => {
//             if (err) {
//                 console.log(err)
//                 return res.status(400).json({
//                     message: 'Bad request'
//                 });
//             } else {
//                 next();
//             }
//         }
//         );   
// }

module.exports.likePost = (req, res, next) => {
    const addPostchema = Joi.object().keys({
        postId: Joi.string().required(),
        userId: Joi.string().required()
    })
    Joi.validate(
        req.body,
        addPostchema,
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


// module.exports.updatePost = (req,res,next) =>{
//     const updatePostchema = Joi.object().keys({
//         content: Joi.string().required(),
//         images:Joi.string().required()

//     })

//     Joi.validate(      
//         req.body,
//         updatePostchema,

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