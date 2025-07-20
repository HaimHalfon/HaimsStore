const mongoose = require("mongoose");

function connectDB() {
	mongoose
		.connect("mongodb://localhost:27017/Project2_DB")
		.then(() => console.log("Connected to Project2_DB"))
		.catch(console.log);
}

module.exports = connectDB;
