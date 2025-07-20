import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useAxiosWithToken } from "../../hooks/useAxiosWithToken";
import MyForm from "../../components/MyForm";
import MyTable from "../../components/MyTable";

function Products() {
	const token = useSelector((state) => state.common.token);
	const products = useSelector((state) => state.admin.products);
	const categories = useSelector((state) => state.admin.categories);

	const dispatch = useDispatch();

	const refAddProduct = useRef(null);
	const [isAddClicked, setIsAddClicked] = useState(false);

	useEffect(() => {
		const el = refAddProduct.current;
		if (isAddClicked) {
			setTimeout(() => {
				el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
			}, 100);
		}
	}, [isAddClicked]);

	const axiosWithToken = useAxiosWithToken(token);

	const handleSubmitUpdateProduct = async (e, { id, title, categoryId, description, price, picLink, inStock }) => {
		e.preventDefault();

		if (
			products.find(
				(product) =>
					product.id === id &&
					product.title === title &&
					product.category.id === categoryId &&
					product.description === description &&
					product.price === price &&
					product.picLink === picLink &&
					product.inStock === inStock
			)
		) {
			alert("לא בוצעו אף שינויים");
			return;
		}

		if (!window.confirm("Are you sure you want to update this Product?")) return "notConfirm";

		if (!title || !categoryId || !price) {
			alert("Title, Category and Price are required");
			return;
		}

		try {
			const { data } = await axiosWithToken.put(`/products/${id}`, {
				title,
				category: { id: categoryId },
				description,
				price,
				picLink,
				inStock,
			});
			dispatch({ type: "UPDATE_PRODUCT", payload: data });

			const usersRes = await axiosWithToken.get("/users/with-products");
			dispatch({ type: "SET_USERS", payload: usersRes.data });

			const categoriesRes = await axiosWithToken.get("/categories/with-products");
			dispatch({ type: "SET_CATEGORIES", payload: categoriesRes.data });
		} catch (err) {
			console.error("Server error:", err);
			alert("The server says: " + (err?.response?.data?.message || "Unknown error"));
		}
	};

	const handleDeleteProduct = async ({ id }) => {
		if (!window.confirm("Are you sure you want to delete this Product?")) return "notConfirm";

		try {
			const { data } = await axiosWithToken.delete(`/products/${id}`);
			dispatch({ type: "DELETE_PRODUCT", payload: data });

			const categoriesRes = await axiosWithToken.get("/categories/with-products");
			dispatch({ type: "SET_CATEGORIES", payload: categoriesRes.data });
		} catch (err) {
			console.error("Server error:", err);
			alert("The server says: " + (err?.response?.data?.message || "Unknown error"));
		}
	};

	const handleSubmitAddProduct = async (e, { title, categoryId, description, price, picLink, inStock }) => {
		e.preventDefault();

		if (!title || !categoryId || !price) {
			alert("Please enter Title, Category and Price");
			return;
		}

		try {
			const { data } = await axiosWithToken.post("/products", {
				title,
				category: { id: categoryId },
				description,
				price,
				picLink,
				inStock,
			});
			dispatch({ type: "ADD_PRODUCT", payload: { ...data, users: [] } });
			setIsAddClicked(false);

			const categoriesRes = await axiosWithToken.get("/categories/with-products");
			dispatch({ type: "SET_CATEGORIES", payload: categoriesRes.data });
		} catch (err) {
			console.error("Server error:", err);
			alert("The server says: " + (err?.response?.data?.message || "Unknown error"));
		}
	};

	return (
		<div className="container">
			<div className="row gx-4 justify-content-center">
				<div className="col-12 col-md-12 col-xl-8">
					<div className="card shadow-sm myStyle-animit-down">
						<div className="card-body p-3 p-md-4">
							<h1 className="card-title mb-2">Products Manange</h1>
							<h5 className="card-subtitle text-muted mb-3">Edit or Add Product</h5>
							<div className="max-vh-65 overflow-y-scroll myStyle-scroll-area pe-2" ref={refAddProduct}>
								<div className="row m-0">
									{products.map((product) => (
										<div key={`formProduct-${product.id}`} className="col-12 p-0 mb-3">
											<div className="card bg-light">
												<div className="card-body p-3 p-md-4">
													<div className="row m-0">
														<div className="col-12 col-md-8 p-0 pb-3 p-md-0 pe-md-3 border-switch">
															<MyForm
																inputs={[
																	{ name: "id", type: "hidden", value: product.id },
																	{ name: "title", label: "Title", type: "text", value: product.title, required: true },
																	{
																		name: "categoryId",
																		label: "Category",
																		type: "select",
																		value: product.category.id,
																		required: true,
																		selectOptions: categories.map((category) => ({
																			value: category.id,
																			label: category.title,
																		})),
																	},
																	{ name: "description", label: "Description", type: "textarea", rows: "2", value: product.description },
																	{ name: "price", label: "Price", type: "number", value: product.price, required: true },
																	{ name: "picLink", label: "Link to pic", type: "text", value: product.picLink },
																	{ name: "inStock", label: "In Stock", type: "number", value: product.inStock },
																]}
																handleSubmit={handleSubmitUpdateProduct}
																buttons={[
																	{ type: "submit", title: "Update", color: "success" },
																	{
																		type: "button",
																		title: "Delete",
																		color: "danger",
																		handle: handleDeleteProduct,
																		disabled: product.totalPurchased > 0,
																	},
																]}
																myKey="formUpdateProduct"
																showCancelButton={true}
															/>
														</div>
														<div className="col-12 col-md-4 p-0 pt-3 p-md-0 ps-md-3">
															{product.users.length > 0 ? (
																<>
																	<h6 className="card-subtitle text-muted mb-3">Purchased By:</h6>
																	<MyTable
																		fields={[
																			{ key: "fullName", label: "Buyer Name" },
																			{ key: "purchasedQuantity", label: "Qty" },
																		]}
																		items={product.users}
																		myKey={`${product.id}-users`}
																	/>
																</>
															) : (
																<h6 className="card-subtitle text-muted mb-3">No buyers yet</h6>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									))}

									{isAddClicked && (
										<div className="col-12 p-0 mb-3">
											<div className="card bg-info-subtle">
												<div className="card-body p-3 p-md-4">
													<div className="row m-0">
														<div className="col-12 col-md-8 p-0 pb-3 p-md-0 pe-md-3 border-switch">
															<MyForm
																inputs={[
																	{ name: "title", label: "Title", type: "text", required: true },
																	{
																		name: "categoryId",
																		label: "Category",
																		type: "select",
																		required: true,
																		selectOptions: categories.map((category) => ({
																			value: category.id,
																			label: category.title,
																		})),
																	},
																	{ name: "description", label: "Description", type: "textarea", rows: "2" },
																	{ name: "price", label: "Price", type: "number", required: true },
																	{ name: "picLink", label: "Link to pic", type: "text" },
																	{ name: "inStock", label: "In Stock", type: "number", value: 0 },
																]}
																handleSubmit={handleSubmitAddProduct}
																buttons={[{ type: "submit", title: "Add", color: "success" }]}
																myKey="formAddProduct"
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="card-footer p-3">
							<button className={`btn btn-${!isAddClicked ? "primary" : "outline-secondary"}`} onClick={() => setIsAddClicked((prev) => !prev)}>
								{!isAddClicked ? "Add New Product" : "Cancel"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Products;
