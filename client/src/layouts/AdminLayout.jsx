import React, { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MyNavbar from "../components/MyNavbar";
import { useAxiosWithToken } from "../hooks/useAxiosWithToken";

function AdminLayout() {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.common.token);

	const axiosWithToken = useAxiosWithToken(token);

	useEffect(() => {
		(async () => {
			try {
				const categoriesRes = await axiosWithToken.get("/categories/with-products");
				dispatch({ type: "SET_CATEGORIES", payload: categoriesRes.data });

				const usersRes = await axiosWithToken.get("/users/with-products");
				dispatch({ type: "SET_USERS", payload: usersRes.data });

				const productsRes = await axiosWithToken.get("/products/with-users");
				dispatch({ type: "SET_PRODUCTS", payload: productsRes.data });
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
					{ title: "Categories", name: "categories", ref: "/admin/categories" },
					{ title: "Customers", name: "customers", ref: "/admin/customers" },
					{ title: "Products", name: "products", ref: "/admin/products" },
					{ title: "Statistics", name: "statistics", ref: "/admin/statistics" },
				]}
			/>

			<Outlet />
		</>
	);
}

export default AdminLayout;
