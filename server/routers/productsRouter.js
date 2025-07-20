const express = require("express");
const router = express.Router();

const productsService = require("../services/productsService");
const checkLogin = require("../middlewares/checkLogin");
const checkAdmin = require("../middlewares/checkAdmin");

// ----------------------------
// Logged user only
// ----------------------------

// Read
router.get("/with-allowed-users", checkLogin, async (req, res) => {
	try {
		const products = await productsService.getProductsWithAllowedUsers(req.query, req.user.id);
		res.json(products);
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
		const { title, category, price } = req.body;

		if (!title || !category || !price) {
			return res.status(400).json({ success: false, message: "Title, Category and Price are required" });
		}

		const product = await productsService.addProduct(req.body);
		res.json(product);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Create Many (Internal use only)
router.post("/many", checkLogin, checkAdmin, async (req, res) => {
	try {
		const products = await Promise.all(req.body.map(async (product) => await productsService.addProduct(product)));
		res.json(products);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Read
router.get("/", checkLogin, checkAdmin, async (req, res) => {
	try {
		const products = await productsService.getProducts(req.query);
		res.json(products);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Read
router.get("/with-users", checkLogin, checkAdmin, async (req, res) => {
	try {
		const products = await productsService.getProductsWithUsers(req.query);
		res.json(products);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Update
router.put("/:id", checkLogin, checkAdmin, async (req, res) => {
	try {
		const product = await productsService.editProduct(req.params.id, req.body);
		res.json(product);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Delete
router.delete("/:id", checkLogin, checkAdmin, async (req, res) => {
	try {
		const product = await productsService.removeProduct(req.params.id);
		res.json(product);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

module.exports = router;
// Entry Point: http://localhost:3000/products
