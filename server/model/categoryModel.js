const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ versionKey: false }
);

module.exports = mongoose.model("Category", categorySchema);
