const commentService = require('../services/comment.service');

addComment = function (req, res) {
	console.log("req.body============>", req.body);
	const commentData = {
		comment: req.body.comment,
		userId: req.body.userId,
		postId: req.body.postId
	}
	commentService.addComment(commentData).then((response) => {
		return res.status(200).json({ status: 1, message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
	})
}

module.exports = {
	addComment: addComment,
};