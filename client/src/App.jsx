import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useAxiosWithToken } from "./hooks/useAxiosWithToken";

import GuestLayout from "./layouts/GuestLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/guest/Login";
import Register from "./pages/guest/Register";

import ProductsCatalog from "./pages/customer/ProductsCatalog/ProductsCatalog";
import Orders from "./pages/customer/Orders";
import Profile from "./pages/customer/Profile";

import Categories from "./pages/admin/Categories";
import Customers from "./pages/admin/Customers";
import Products from "./pages/admin/Products";
import Statistics from "./pages/admin/Statistics";

function App() {
	const [isLoggedUserReady, setIsLoggedUserReady] = useState(false);
	const [isSessionDataReady, setIsSessionDataReady] = useState(false);

	const dispatch = useDispatch();
	const token = useSelector((state) => state.common.token);
	const loggedUser = useSelector((state) => state.common.loggedUser);
	const cartItems = useSelector((state) => state.customer.cartItems);

	const axiosWithToken = useAxiosWithToken(token);

	useEffect(() => {
		const sessionToken = sessionStorage.getItem("token");
		if (sessionToken) {
			dispatch({ type: "SET_TOKEN", payload: sessionToken });
		}

		const sessionCartItems = sessionStorage.getItem("cartItems");
		if (sessionCartItems && sessionCartItems.length) {
			dispatch({ type: "SET_CART_ITEMS", payload: JSON.parse(sessionCartItems) });
		}

		setIsSessionDataReady(true);
	}, []);

	useEffect(() => {
		if (isSessionDataReady) sessionStorage.setItem("token", token);
	}, [token]);

	useEffect(() => {
		if (isSessionDataReady) sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
	}, [cartItems]);

	useEffect(() => {
		(async () => {
			if (!token) {
				setIsLoggedUserReady(true);
				return;
			}

			try {
				const { id } = jwtDecode(token);
				const { data } = await axiosWithToken.get(`/users/${id}`);
				const { username, fullName, allowOthers, role } = data;

				dispatch({ type: "SET_LOGGED_USER", payload: { id, username, fullName, allowOthers, role } });
			} catch (err) {
				console.error("Server error:", err);
				alert("The server says: " + (err?.response?.data?.message || "Unknown error"));
			} finally {
				setIsLoggedUserReady(true);
			}
		})();
	}, [token]);

	if (!isLoggedUserReady) return <div>Loading User...</div>;

	return (
		<>
			<Routes>
				{/* דפים לציבור הלא מחובר */}
				{!loggedUser && (
					<Route element={<GuestLayout />}>
						<Route path="/guest/login" element={<Login />} />
						<Route path="/guest/register" element={<Register />} />
						<Route path="*" element={<Navigate to="/guest/login" />} />
					</Route>
				)}

				{/* דפים ללקוח */}
				{loggedUser && loggedUser.role === "customer" && (
					<Route element={<CustomerLayout />}>
						<Route path="/customer/products-catalog" element={<ProductsCatalog />} />
						<Route path="/customer/orders" element={<Orders />} />
						<Route path="/customer/profile" element={<Profile />} />
						<Route path="*" element={<Navigate to="/customer/products-catalog" />} />
					</Route>
				)}

				{/* דפים למנהל */}
				{loggedUser && loggedUser.role === "admin" && (
					<Route element={<AdminLayout />}>
						<Route path="/admin/categories" element={<Categories />} />
						<Route path="/admin/customers" element={<Customers />} />
						<Route path="/admin/products" element={<Products />} />
						<Route path="/admin/statistics" element={<Statistics />} />
						<Route path="*" element={<Navigate to="/admin/categories" />} />
					</Route>
				)}
			</Routes>
		</>
	);
}

export default App;
