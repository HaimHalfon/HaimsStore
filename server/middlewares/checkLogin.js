const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ success: false, message: "No token provided" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: decoded.id, role: decoded.role };
		return next();
	} catch (err) {
		console.error("Invalid token", err.message);
		return res.status(403).json({ success: false, message: "Invalid token" });
	}
};

module.exports = checkLogin;
