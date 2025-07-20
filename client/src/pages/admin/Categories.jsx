import React, { useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useAxiosWithToken } from "../../hooks/useAxiosWithToken";

import MyForm from "../../components/MyForm";
import MyList from "../../components/MyList";

function Categories() {
	const token = useSelector((state) => state.common.token);
	const categories = useSelector((state) => state.admin.categories);
	const dispatch = useDispatch();
	const refBottomCategories = useRef(null);
	const axiosWithToken = useAxiosWithToken(token);

	const handleUpdateCategory = async (id, inputData) => {
		if (categories.find((category) => category.id === id && category.title === inputData)) return;

		try {
			const { data } = await axiosWithToken.put(`/categories/${id}`, { title: inputData });
			dispatch({ type: "UPDATE_CATEGORY", payload: data });
		} catch (err) {
			console.error("Server error:", err);
			alert("The server says: " + (err?.response?.data?.message || "Unknown error"));
		}
	};

	const handleDeleteCategory = async (id) => {
		if (!window.confirm("Are you sure you want to delete this Category?")) return "notConfirm";

		try {
			const { data } = await axiosWithToken.delete(`/categories/${id}`);
			dispatch({ type: "DELETE_CATEGORY", payload: data });
		} catch (err) {
			console.error("Server error:", err);
			alert("The server says: " + (err?.response?.data?.message || "Unknown error"));
		}
	};

	const handleOverCategory = (id) => {
		return {
			fields: [{ key: "title", label: "Products in this Category" }],
			items: categories.find((category) => category.id === id).products,
			myKey: `${id}-bubble`,
		};
	};

	const handleSubmitAddCategory = async (e, formData, resetForm) => {
		e.preventDefault();

		const { title } = formData;
		if (!title) {
			alert("Please enter catgeory");
			return;
		}

		try {
			const { data } = await axiosWithToken.post("/categories", { title });
			dispatch({ type: "ADD_CATEGORY", payload: { ...data, products: [] } });
			resetForm();
		} catch (err) {
			console.error("Server error:", err);
			alert("The server says: " + (err?.response?.data?.message || "Unknown error"));
		}

		const el = refBottomCategories.current;
		setTimeout(() => {
			el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
		}, 100);
	};

	return (
		<div className="container">
			<div className="row gx-4 justify-content-center">
				<div className="col-12 col-md-9 col-xl-6">
					<div className="card shadow-sm myStyle-animit-down">
						<div className="card-body p-3 p-md-4">
							<h1 className="card-title mb-2">Categories Manange</h1>
							<h5 className="card-subtitle text-muted mb-3">Edit or Add Category</h5>
							<div className="max-vh-60 overflow-y-scroll myStyle-scroll-area pe-2" ref={refBottomCategories}>
								<MyList
									items={categories.map((category) => ({ id: category.id, value: category.title }))}
									handlers={{
										updateItem: handleUpdateCategory,
										deleteItem: handleDeleteCategory,
										overItem: handleOverCategory,
									}}
									myKey="categories"
								/>
							</div>
						</div>
						<div className="card-footer p-3">
							<MyForm
								inputs={[{ name: "title", label: "Title", type: "text", required: true }]}
								handleSubmit={handleSubmitAddCategory}
								buttons={[{ type: "submit", title: "Add New Category", color: "success" }]}
								myKey="categories"
								horizontally={true}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Categories;
