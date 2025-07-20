const categoriesRepo = require("../repositories/categoriesRepo");
const productsRepo = require("../repositories/productsRepo");
const ordersRepo = require("../repositories/ordersRepo");

// ----------------------------
// Regular CRUD functions
// ----------------------------

function addCategory(category) {
	return categoriesRepo.createCategory(category);
}

function getCategories(filters) {
	return categoriesRepo.readCategories(filters);
}

function getCategoryById(id) {
	return categoriesRepo.readCategoryById(id);
}

function editCategory(id, data) {
	return categoriesRepo.updateCategory(id, data);
}

async function removeCategory(id) {
	const products = await productsRepo.readProducts({ categoryId: id });
	if (products.length) throw new Error("The category cannot be removed because there are products listed in it");

	return categoriesRepo.deleteCategory(id);
}

// ----------------------------
// Other functions
// ----------------------------

async function getCategoriesWithProducts(filters) {
	const categories = await categoriesRepo.readCategories(filters);
	const products = await productsRepo.readProducts();
	const orders = await ordersRepo.readOrdersFullProducts();

	const categoriesMap = categories.reduce((acc, category) => {
		acc[category.id] = {
			...category,
			totalPurchased: 0,
			products: [],
		};
		return acc;
	}, {});

	products.forEach((product) => {
		if (categoriesMap[product.category.id]) {
			categoriesMap[product.category.id].products.push({
				...product,
				purchasedQuantity: 0,
			});
		}
	});

	orders.forEach((order) => {
		order.products.forEach(({ product, purchasedQuantity }) => {
			if (categoriesMap[product.category.id]) {
				const productItem = categoriesMap[product.category.id].products.find((prod) => prod.id.equals(product.id));
				productItem.purchasedQuantity += purchasedQuantity;
				categoriesMap[product.category.id].totalPurchased += purchasedQuantity;
			}
		});
	});

	return Object.values(categoriesMap);
}

module.exports = {
	addCategory,
	getCategories,
	getCategoryById,
	editCategory,
	removeCategory,

	getCategoriesWithProducts,
};
