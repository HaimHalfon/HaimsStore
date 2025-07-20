const express = require("express");
const router = express.Router();

const categoriesService = require("../services/categoriesService");
const checkLogin = require("../middlewares/checkLogin");
const checkAdmin = require("../middlewares/checkAdmin");

// ----------------------------
// Logged user only
// ----------------------------

// Read
router.get("/", checkLogin, async (req, res) => {
	try {
		const categories = await categoriesService.getCategories(req.query);
		res.json(categories);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// ----------------------------
// Admin only
// ----------------------------

// Create
router.post("/", checkLogin, checkAdmin, async (req, res) => {
	try {
		const { title } = req.body;

		if (!title) {
			return res.status(400).json({ success: false, message: "title is required" });
		}

		const category = await categoriesService.addCategory(req.body);
		res.json(category);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Create Many (Internal use only)
router.post("/many", checkLogin, checkAdmin, async (req, res) => {
	try {
		const categories = await Promise.all(req.body.map(async (category) => await categoriesService.addCategory(category)));
		res.json(categories);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Read
router.get("/with-products", checkLogin, checkAdmin, async (req, res) => {
	try {
		const categories = await categoriesService.getCategoriesWithProducts(req.query);
		res.json(categories);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Update
router.put("/:id", checkLogin, checkAdmin, async (req, res) => {
	try {
		const category = await categoriesService.editCategory(req.params.id, req.body);
		res.json(category);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Delete
router.delete("/:id", checkLogin, checkAdmin, async (req, res) => {
	try {
		const category = await categoriesService.removeCategory(req.params.id);
		res.json(category);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

module.exports = router;
// Entry Point: http://localhost:3000/categories
