const ordersRepo = require("../repositories/ordersRepo");
const productsRepo = require("../repositories/productsRepo");

// ----------------------------
// Regular CRUD functions
// ----------------------------

async function addOrder(order) {
	const newOrder = {
		user: order.user.id,
		totalPrice: 0,
		products: [],
	};

	const inStockMap = [];

	for (const { product, purchasedQuantity } of order.products) {
		const productFull = await productsRepo.readProductById(product.id);

		if (productFull.inStock < purchasedQuantity) {
			throw new Error(`Not enough in stock for product ${productFull.title}`);
		}

		newOrder.totalPrice += productFull.price * purchasedQuantity;

		newOrder.products.push({
			product,
			priceAtPurchase: productFull.price,
			purchasedQuantity,
		});

		inStockMap[productFull.id] = productFull.inStock;
	}

	const orderAdded = await ordersRepo.createOrder(newOrder);

	for (const { product, purchasedQuantity } of order.products) {
		await productsRepo.updateProduct(product.id, { inStock: inStockMap[product.id] - purchasedQuantity });
	}

	return orderAdded;
}

function getOrders(filters) {
	return ordersRepo.readOrders(filters);
}

function getOrderById(id) {
	return ordersRepo.readOrderById(id);
}

function editOrder(id, data) {
	return ordersRepo.updateOrder(id, data);
}

function removeOrder(id) {
	return ordersRepo.deleteOrder(id);
}

// ----------------------------
// Full Read Functions
// ----------------------------

function getOrdersFullUser(filters) {
	return ordersRepo.readOrdersFullUser(filters);
}

function getOrdersFullProducts(filters) {
	return ordersRepo.readOrdersFullProducts(filters);
}

module.exports = {
	addOrder,
	getOrders,
	getOrderById,
	editOrder,
	removeOrder,

	getOrdersFullUser,
	getOrdersFullProducts,
};
