const _ = require("lodash");

const checkAdminOrOwner = (reqPathOwnerId) => (req, res, next) => {
	const tokenUser = req.user;
	const ownerId = _.get(req, reqPathOwnerId);

	if (tokenUser.role === "admin" || tokenUser.id === ownerId) {
		return next();
	}

	return res.status(403).json({ success: false, message: "Access denied: Admins or Owner only" });
};

module.exports = checkAdminOrOwner;
