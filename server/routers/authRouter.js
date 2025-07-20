const express = require("express");
const authService = require("../services/authService");
const usersService = require("../services/usersService");

const router = express.Router();

// ----------------------------
// Everyone
// ----------------------------

// Login
router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({ success: false, message: "Username and password are required" });
		}

		const { user, token } = await authService.login(username, password);

		res.json({ success: true, message: "Login successful", loggedUser: user, token });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Register
router.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({ success: false, message: "Username and Password are required" });
		}

		const user = await usersService.addUser(req.body);
		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

module.exports = router;
// Entry Point: http://localhost:3000/auth
