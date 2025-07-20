const checkAdminOrInjectOwner = (queryFieldName) => (req, res, next) => {
	const tokenUser = req.user;

	if (tokenUser.role !== "admin") {
		req.myQuery = { [queryFieldName]: tokenUser.id };
	}

	return next();
};

module.exports = checkAdminOrInjectOwner;
