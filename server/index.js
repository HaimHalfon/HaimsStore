const express = require("express");
const cors = require("cors");
const connectDB = require("./configs/db");

const authRouter = require("./routers/authRouter");
const usersRouter = require("./routers/usersRouter");
const productsRouter = require("./routers/productsRouter");
const categoriesRouter = require("./routers/categoriesRouter");
const ordersRouter = require("./routers/ordersRouter");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("HAIM HALFON Project 2");
});

// ROUTES

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/orders", ordersRouter);

app.use((req, res) => {
	res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, () => {
	console.log(`app is listening at http://localhost:${PORT}`);
	connectDB();
});
// Entry Point: http://localhost:3000
