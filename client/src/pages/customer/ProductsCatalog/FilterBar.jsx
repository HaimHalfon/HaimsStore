import React from "react";

import MyForm from "../../../components/MyForm";

function FilterBar({ filters, maxPrice, categories, handleChange }) {
	return (
		<div className="card shadow-sm flex-grow-1 mb-3 me-0 me-md-5 p-3 myStyle-animit-down">
			<MyForm
				inputs={[
					{ name: "title", label: "Title", type: "text", value: filters.title },
					{ name: "price", label: "Price", type: "range", value: filters.price, min: 1, max: maxPrice, unitSymbol: "$" },
					{
						name: "categoryId",
						label: "Category",
						type: "select",
						value: filters.categoryId,
						selectOptions: [
							{ value: "-1", label: "All" },
							...categories.map((category) => ({
								value: category.id,
								label: category.title,
							})),
						],
					},
				]}
				handleChange={handleChange}
				myKey="filterBar"
				showCancelButton={true}
				horizontally={true}
			/>
		</div>
	);
}

export default FilterBar;
