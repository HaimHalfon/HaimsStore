const usersRepo = require("../repositories/usersRepo");
const ordersRepo = require("../repositories/ordersRepo");

// ----------------------------
// Regular CRUD functions
// ----------------------------

function addUser(user) {
	return usersRepo.createUser(user);
}

function getUsers(filters) {
	return usersRepo.readUsers(filters);
}

function getUserById(id) {
	return usersRepo.readUserById(id);
}

async function editUser(id, data) {
	if (data.password) {
		const userDoc = await usersRepo.userDoc(id);
		userDoc.password = data.password;
		await userDoc.save();
		delete data.password;
	}

	if (data.role) {
		delete data.role;
	}

	return usersRepo.updateUser(id, data);
}

async function removeUser(id) {
	const orders = await ordersRepo.readOrders({ userId: id });
	if (orders.length) throw new Error("The user cannot be removed because he has orders");

	return usersRepo.deleteUser(id);
}

// ----------------------------
// Other functions
// ----------------------------

function getUserByUsername(username) {
	return usersRepo.readUserByUsername(username);
}

async function getUsersWithProducts(filters) {
	const users = await usersRepo.readUsers(filters);
	const orders = await ordersRepo.readOrdersFullProducts();

	const usersMap = users.reduce((acc, user) => {
		acc[user.id] = {
			...user,
			totalPurchased: 0,
			products: [],
		};
		return acc;
	}, {});

	orders.forEach((order) => {
		order.products.forEach(({ product, purchasedQuantity }) => {
			if (usersMap[order.user.id]) {
				const productItem = usersMap[order.user.id].products.find((prod) => prod.id.equals(product.id));

				if (!productItem) {
					usersMap[order.user.id].products.push({
						...product,
						purchasedQuantity,
					});
				} else {
					productItem.purchasedQuantity += purchasedQuantity;
				}

				usersMap[order.user.id].totalPurchased += purchasedQuantity;
			}
		});
	});

	return Object.values(usersMap);
}

module.exports = {
	addUser,
	getUsers,
	getUserById,
	getUserByUsername,
	editUser,
	removeUser,

	getUsersWithProducts,
};
