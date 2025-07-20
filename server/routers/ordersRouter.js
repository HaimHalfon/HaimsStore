const express = require("express");
const router = express.Router();

const ordersService = require("../services/ordersService");
const checkLogin = require("../middlewares/checkLogin");
const checkAdmin = require("../middlewares/checkAdmin");
const checkAdminOrOwner = require("../middlewares/checkAdminOrOwner");
const checkAdminOrInjectOwner = require("../middlewares/checkAdminOrInjectOwner");

// ----------------------------
// Admin only
// ----------------------------

// Create Many (Internal use only)
router.post("/many", checkLogin, checkAdmin, async (req, res) => {
	try {
		const orders = await Promise.all(req.body.map(async (order) => await ordersService.addOrder(order)));
		res.json(orders);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// ----------------------------
// Admin or Owner only
// ----------------------------

// Create
router.post("/", checkLogin, checkAdminOrOwner("body.user.id"), async (req, res) => {
	try {
		const { user, products } = req.body;

		if (!user.id || !products) {
			return res.status(400).json({ success: false, message: "user and products are required" });
		}

		const order = await ordersService.addOrder(req.body);
		res.json(order);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Read
router.get("/", checkLogin, checkAdminOrInjectOwner("userId"), async (req, res) => {
	try {
		const orders = await ordersService.getOrders(req.query);
		res.json(orders);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

// Read
router.get("/full-products", checkLogin, checkAdminOrInjectOwner("userId"), async (req, res) => {
	try {
		const orders = await ordersService.getOrdersFullProducts({ ...req.query, ...req.myQuery });
		res.json(orders);
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err.message || "Server error" });
	}
});

module.exports = router;
// Entry Point: http://localhost:3000/orders
