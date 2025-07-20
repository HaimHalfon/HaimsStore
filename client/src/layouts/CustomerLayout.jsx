import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MyNavbar from "../components/MyNavbar";
import { useAxiosWithToken } from "../hooks/useAxiosWithToken";

function CustomerLayout() {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.common.token);

	const axiosWithToken = useAxiosWithToken(token);

	useEffect(() => {
		(async () => {
			try {
				const categoriesRes = await axiosWithToken.get("/categories");
				dispatch({ type: "SET_CATEGORIES", payload: categoriesRes.data });

				const productsRes = await axiosWithToken.get("/products/with-allowed-users");
				dispatch({ type: "SET_PRODUCTS", payload: productsRes.data });

				const ordersRes = await axiosWithToken.get("/orders/full-products");
				dispatch({ type: "SET_ORDERS", payload: ordersRes.data });

				dispatch({ type: "SET_CART_ITEMS", payload: [] });
			} catch (err) {
				console.error("Server error:", err);
				alert("The server says: " + (err?.response?.data?.message || "Unknown error"));
			}
		})();
	}, []);

	return (
		<>
			<MyNavbar
				logo="Haim's Store"
				navLinks={[
					{ title: "Products Catalog", name: "products-catalog", ref: "/customer/products-catalog" },
					{ title: "My Orders", name: "orders", ref: "/customer/orders" },
					{ title: "Profile Settings", name: "profile", ref: "/customer/profile" },
				]}
			/>

			<Outlet />
		</>
	);
}

export default CustomerLayout;
