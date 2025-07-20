const Order = require("../model/orderModel");
const { userMyFormat } = require("./usersRepo");
const { productMyFormat } = require("./productsRepo");

// ----------------------------
// Regular CRUD functions
// ----------------------------

async function createOrder(order) {
	const newOrder = new Order(orderDocFormat(order));
	const saved = await newOrder.save();
	return orderMyFormat(saved);
}

async function readOrders(filters) {
	const orders = await Order.find(filters);
	return orders.map(orderMyFormat);
}

async function readOrderById(id) {
	const order = await Order.findById(id);
	return orderMyFormat(order);
}

async function updateOrder(id, data) {
	const updated = await Order.findByIdAndUpdate(id, orderDocFormat(data), { new: true });
	return orderMyFormat(updated);
}

async function deleteOrder(id) {
	const deleted = await Order.findByIdAndDelete(id);
	return orderMyFormat(deleted);
}

// ----------------------------
// Full Read Functions
// ----------------------------

async function readOrdersFullProducts(filters) {
	const orders = await Order.find(filters).populate("products.productId");
	return orders.map(orderMyFormat);
}

async function readOrdersFullUser(filters) {
	const orders = await Order.find(filters).populate("userId");
	return orders.map(orderMyFormat);
}

// ----------------------------
// Helper Functions
// ----------------------------

function orderDoc(id) {
	return Order.findById(id);
}

function orderMyFormat(orderDoc) {
	if (!orderDoc) return null;

	const { _id, userId, products, totalPrice, orderDate } = orderDoc;
	return {
		id: _id,
		user: userId.fullName ? userMyFormat(userId) : { id: userId },
		totalPrice,
		orderDate,
		products: products.map(({ productId, priceAtPurchase, purchasedQuantity }) => ({
			product: productId.title ? productMyFormat(productId) : { id: productId },
			priceAtPurchase,
			purchasedQuantity,
		})),
	};
}

function orderDocFormat(orderObj = {}) {
	const { id, user, totalPrice, orderDate, products } = orderObj;

	return {
		...(id !== undefined && { _id: id }),
		...(user !== undefined && { userId: user?.id ?? user }),
		...(totalPrice !== undefined && { totalPrice }),
		...(orderDate !== undefined && { orderDate }),
		...(Array.isArray(products) && {
			products: products.map(({ product, priceAtPurchase, purchasedQuantity }) => ({
				...(product !== undefined && { productId: product?.id ?? product }),
				...(priceAtPurchase !== undefined && { priceAtPurchase }),
				...(purchasedQuantity !== undefined && { purchasedQuantity }),
			})),
		}),
	};
}

module.exports = {
	createOrder,
	readOrders,
	readOrderById,
	updateOrder,
	deleteOrder,

	readOrdersFullProducts,
	readOrdersFullUser,

	orderDoc,
	orderMyFormat,
};
