import mongoose from "mongoose";
import dotenv from "dotenv";
import jf from "jsonfile";

dotenv.config();

import { createUser } from "./repositories/usersRepo.js";
import { createCategory } from "./repositories/categoriesRepo.js";
import { createProduct } from "./repositories/productsRepo.js";
import { createOrder } from "./repositories/ordersRepo.js";

import User from "./model/userModel.js";
import Product from "./model/productModel.js";
import Category from "./model/categoryModel.js";
import Order from "./model/orderModel.js";

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB Connected");
	} catch (error) {
		console.error("MongoDB connection failed:", error);
		process.exit(1);
	}
};

const seedDB = async () => {
	await connectDB();

	try {
		await Promise.all([User.deleteMany(), Product.deleteMany(), Category.deleteMany(), Order.deleteMany()]);

		const users = await jf.readFile("./exampleData/users.json");
		const categories = await jf.readFile("./exampleData/categories.json");
		const products = await jf.readFile("./exampleData/products.json");
		const orders = await jf.readFile("./exampleData/orders.json");

		for (const u of users) {
			await createUser(u);
		}

		for (const c of categories) {
			await createCategory(c);
		}

		for (const p of products) {
			await createProduct(p);
		}

		for (const o of orders) {
			await createOrder(o);
		}

		console.log("Database seeded successfully");
		process.exit();
	} catch (error) {
		console.error("Failed to seed database:", error);
		process.exit(1);
	}
};

seedDB();
