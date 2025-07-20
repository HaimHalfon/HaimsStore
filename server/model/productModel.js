const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		description: {
			type: String,
		},
		price: {
			type: Number,
			required: true,
		},
		picLink: {
			type: String,
		},
		inStock: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true },
	{ versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);
