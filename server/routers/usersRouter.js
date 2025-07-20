const express = require("express");
const router = express.Router();

const usersService = require("../services/usersService");
const checkLogin = require("../middlewares/checkLogin");
const checkAdmin = require("../middlewares/checkAdmin");
const checkAdminOrOwner = require("../middlewares/checkAdminOrOwner");

// ----------------------------
// Admin only
// ----------------------------

// Create Many (Internal use only)
router.post("/many", checkLogin, checkAdmin, async (req, res) => {
	try {
		const users = await Promise.all(req.body.map(async (user) => await usersService.addUser(user)));
		res.json(users);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Read
router.get("/", checkLogin, checkAdmin, async (req, res) => {
	try {
		const users = await usersService.getUsers(req.query);
		res.json(users);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Read
router.get("/with-products", checkLogin, checkAdmin, async (req, res) => {
	try {
		const users = await usersService.getUsersWithProducts(req.query);
		res.json(users);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Delete
router.delete("/:id", checkLogin, checkAdmin, async (req, res) => {
	try {
		const user = await usersService.removeUser(req.params.id);
		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// ----------------------------
// Admin or Owner only
// ----------------------------

// Read by Id
router.get("/:id", checkLogin, checkAdminOrOwner("params.id"), async (req, res) => {
	try {
		const user = await usersService.getUserById(req.params.id);
		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Update
router.put("/:id", checkLogin, checkAdminOrOwner("params.id"), async (req, res) => {
	try {
		const user = await usersService.editUser(req.params.id, req.body);
		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

module.exports = router;
// Entry Point: http://localhost:3000/users
