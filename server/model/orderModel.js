const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		totalPrice: {
			type: Number,
			required: true,
		},
		orderDate: {
			type: Date,
			default: Date.now,
		},
		products: [
			{
				_id: false,
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				priceAtPurchase: {
					type: Number,
					required: true,
				},
				purchasedQuantity: {
					type: Number,
					required: true,
				},
			},
		],
	},
	{ timestamps: true },
	{ versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);
