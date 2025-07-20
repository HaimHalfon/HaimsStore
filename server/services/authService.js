const jwt = require("jsonwebtoken");
const usersRepo = require("../repositories/usersRepo");

async function login(username, password) {
	const user = await usersRepo.readUserByUsername(username);

	if (!user) {
		throw new Error("User not found");
	}

	const userDoc = await usersRepo.userDoc(user.id);
	const isMatch = await userDoc.comparePassword(password);

	if (!isMatch) {
		throw new Error("Invalid password");
	}

	const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

	return { user, token };
}

module.exports = {
	login,
};
