const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			default: "",
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		allowOthers: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			enum: ["customer", "admin"],
			default: "customer",
		},
	},
	{ timestamps: true },
	{ versionKey: false }
);

userSchema.pre("save", async function (next) {
	const user = this;

	if (!user.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(user.password, salt);
		user.password = hash;
		next();
	} catch (err) {
		next(err);
	}
});

userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
