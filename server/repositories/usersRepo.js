const User = require("../model/userModel");

// ----------------------------
// Regular CRUD functions
// ----------------------------

async function createUser(user) {
	const newUser = new User(userDocFormat(user));
	const saved = await newUser.save();
	return userMyFormat(saved);
}

async function readUsers(filters) {
	const users = await User.find(filters);
	return users.map(userMyFormat);
}

async function readUserById(id) {
	const user = await User.findById(id);
	return userMyFormat(user);
}

async function readUserByUsername(username) {
	const user = await User.findOne({ username });
	return userMyFormat(user);
}

async function updateUser(id, data) {
	const updated = await User.findByIdAndUpdate(id, userDocFormat(data), { new: true });
	return userMyFormat(updated);
}

async function deleteUser(id) {
	const deleted = await User.findByIdAndDelete(id);
	return userMyFormat(deleted);
}

// ----------------------------
// Helper Functions
// ----------------------------

function userDoc(id) {
	return User.findById(id);
}

function userMyFormat(userDoc) {
	if (!userDoc) return null;

	const { _id, fullName, username, allowOthers, role, createdAt } = userDoc;
	return {
		id: _id,
		fullName,
		username,
		allowOthers,
		role,
		joinedAt: createdAt,
	};
}

function userDocFormat(userObj = {}) {
	const { id, fullName, username, password, allowOthers, role, joinedAt } = userObj;

	return {
		...(id !== undefined && { _id: id }),
		...(fullName !== undefined && { fullName }),
		...(username !== undefined && { username }),
		...(password !== undefined && { password }),
		...(allowOthers !== undefined && { allowOthers }),
		...(role !== undefined && { role }),
		...(joinedAt !== undefined && { createdAt: joinedAt }),
	};
}

module.exports = {
	createUser,
	readUsers,
	readUserById,
	readUserByUsername,
	updateUser,
	deleteUser,

	userDoc,
	userMyFormat,
};
