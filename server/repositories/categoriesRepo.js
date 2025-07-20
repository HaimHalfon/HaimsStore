const Category = require("../model/categoryModel");

// ----------------------------
// Regular CRUD functions
// ----------------------------

async function createCategory(category) {
	const newCategory = new Category(categoryDocFormat(category));
	const saved = await newCategory.save();
	return categoryMyFormat(saved);
}

async function readCategories(filters) {
	const categories = await Category.find(filters);
	return categories.map(categoryMyFormat);
}

async function readCategoryById(id) {
	const category = await Category.findById(id);
	return categoryMyFormat(category);
}

async function updateCategory(id, data) {
	const updated = await Category.findByIdAndUpdate(id, categoryDocFormat(data), { new: true });
	return categoryMyFormat(updated);
}

async function deleteCategory(id) {
	const deleted = await Category.findByIdAndDelete(id);
	return categoryMyFormat(deleted);
}

// ----------------------------
// Helper Functions
// ----------------------------

function categoryDoc(id) {
	return Category.findById(id);
}

function categoryMyFormat(categoryDoc) {
	if (!categoryDoc) return null;

	const { _id, title } = categoryDoc;
	return {
		id: _id,
		title,
	};
}

function categoryDocFormat(categoryObj = {}) {
	const { id, title } = categoryObj;

	return {
		...(id !== undefined && { _id: id }),
		...(title !== undefined && { title }),
	};
}

module.exports = {
	createCategory,
	readCategories,
	readCategoryById,
	updateCategory,
	deleteCategory,

	categoryDoc,
	categoryMyFormat,
};
