const checkAdmin = (req, res, next) => {
	const tokenUser = req.user;

	if (tokenUser.role === "admin") {
		return next();
	}

	return res.status(403).json({ success: false, message: "Access denied: Admins only" });
};

module.exports = checkAdmin;
