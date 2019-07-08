const hashTagService = require('../services/hashTag.service');

/** Add hashTag */
addTag = function (req, res) {
	const { hashTag } = req.body;
	console.log(hashTag)
	hashTagService.addTag(hashTag).then((response) => {
		return res.status(200).json({ status: 1, message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
	})
}

/**Get HashTag */
getTag = function (req, res) {
	hashTagService.getTag().then((response) => {
		return res.status(200).json({ status: 1, message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
	})
}

module.exports = {
	addTag: addTag,
	getTag: getTag
}