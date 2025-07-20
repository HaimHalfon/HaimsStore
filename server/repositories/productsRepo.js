const Product = require("../model/productModel");
const { categoryMyFormat } = require("./categoriesRepo");

// ----------------------------
// Regular CRUD functions
// ----------------------------

async function createProduct(product) {
	const newProduct = new Product(productDocFormat(product));
	const saved = await newProduct.save();
	return productMyFormat(saved);
}

async function readProducts(filters) {
	const products = await Product.find(filters);
	return products.map(productMyFormat);
}

async function readProductById(id) {
	const product = await Product.findById(id);
	return productMyFormat(product);
}

async function updateProduct(id, data) {
	const updated = await Product.findByIdAndUpdate(id, productDocFormat(data), { new: true });
	return productMyFormat(updated);
}

async function deleteProduct(id) {
	const deleted = await Product.findByIdAndDelete(id);
	return productMyFormat(deleted);
}

// ----------------------------
// Full Read Functions
// ----------------------------

async function readProductsFullCategory(filters) {
	const products = await Product.find(filters).populate("categoryId");
	return products.map(productMyFormat);
}

// ----------------------------
// Helper Functions
// ----------------------------

function productDoc(id) {
	return Product.findById(id);
}

function productMyFormat(productDoc) {
	if (!productDoc) return null;

	const { _id, title, categoryId, description, price, picLink, inStock } = productDoc;
	return {
		id: _id,
		title,
		category: categoryId.title ? categoryMyFormat(categoryId) : { id: categoryId },
		description,
		price,
		picLink,
		inStock,
	};
}

function productDocFormat(productObj = {}) {
	const { id, title, category, description, price, picLink, inStock } = productObj;

	return {
		...(id !== undefined && { _id: id }),
		...(title !== undefined && { title }),
		...(category !== undefined && { categoryId: category?.id ?? category }),
		...(description !== undefined && { description }),
		...(price !== undefined && { price }),
		...(picLink !== undefined && { picLink }),
		...(inStock !== undefined && { inStock }),
	};
}

module.exports = {
	createProduct,
	readProducts,
	readProductById,
	updateProduct,
	deleteProduct,

	readProductsFullCategory,

	productDoc,
	productMyFormat,
};
