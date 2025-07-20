const productsRepo = require("../repositories/productsRepo");
const ordersRepo = require("../repositories/ordersRepo");

// ----------------------------
// Regular CRUD functions
// ----------------------------

function addProduct(product) {
	return productsRepo.createProduct(product);
}

function getProducts(filters) {
	return productsRepo.readProducts(filters);
}

function getProductById(id) {
	return productsRepo.readProductById(id);
}

function editProduct(id, data) {
	return productsRepo.updateProduct(id, data);
}

async function removeProduct(id) {
	const orders = await ordersRepo.readOrders({ "products.productId": id });
	if (orders.length) throw new Error("The product cannot be removed because it exists in orders");

	return productsRepo.deleteProduct(id);
}

// ----------------------------
// Full Read Functions
// ----------------------------

function getProductsFullCategory(filters) {
	return productsRepo.readProductsFullCategory(filters);
}

// ----------------------------
// Other functions
// ----------------------------
async function getProductsWithUsers(filters) {
	const products = await productsRepo.readProducts(filters);
	const orders = await ordersRepo.readOrdersFullUser();

	const productsMap = products.reduce((acc, product) => {
		acc[product.id] = {
			...product,
			totalPurchased: 0,
			users: [],
		};
		return acc;
	}, {});

	orders.forEach((order) => {
		order.products.forEach(({ product, purchasedQuantity }) => {
			if (productsMap[product.id]) {
				const userItem = productsMap[product.id].users.find((u) => u.id.equals(order.user.id));

				if (!userItem) {
					productsMap[product.id].users.push({
						...order.user,
						purchasedQuantity,
					});
				} else {
					userItem.purchasedQuantity += purchasedQuantity;
				}

				productsMap[product.id].totalPurchased += purchasedQuantity;
			}
		});
	});

	return Object.values(productsMap);
}

async function getProductsWithAllowedUsers(filters, loggedUserId) {
	const productsWithUsers = await getProductsWithUsers(filters);

	return productsWithUsers.map((product) => {
		const allowedUsers = product.users.filter((user) => user.allowOthers || user.id.equals(loggedUserId));
		const newTotalPurchased = allowedUsers.reduce((acc, user) => acc + user.purchasedQuantity, 0);

		return {
			...product,
			totalPurchased: newTotalPurchased,
			users: allowedUsers,
		};
	});
}

module.exports = {
	addProduct,
	getProducts,
	getProductById,
	editProduct,
	removeProduct,

	getProductsFullCategory,

	getProductsWithUsers,
	getProductsWithAllowedUsers,
};
