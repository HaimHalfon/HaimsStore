import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import Product from "./Product.jsx";
import FilterBar from "./FilterBar.jsx";
import Cart from "./Cart.jsx";

function ProductsCatalog() {
	const products = useSelector((state) => state.customer.products);
	const categories = useSelector((state) => state.customer.categories);
	const cartItems = useSelector((state) => state.customer.cartItems);

	const maxPrice = useMemo(() => {
		if (!products?.length) return null;
		return Math.max(...products.map((p) => p.price));
	}, [products]);

	const [filters, setFilters] = useState({ categoryId: "-1", price: maxPrice, title: "" });
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);

	useEffect(() => {
		setFilters((prev) => ({ ...prev, price: maxPrice }));
	}, [maxPrice]);

	useEffect(() => {
		setFilteredProducts(
			products.filter(
				(product) =>
					(filters.categoryId === "-1" || product.category.id === filters.categoryId) &&
					product.price <= filters.price &&
					product.title
						.toLowerCase()
						.split(" ")
						.some((word) => word.startsWith(filters.title.toLowerCase()))
			)
		);
	}, [filters, products]);

	const handleChange = ({ categoryId, price, title }) => {
		setFilters({ categoryId, price, title });
	};

	if (filters.price === null) return <div>Loading...</div>;

	return (
		<div className="container-fluid">
			<div className="row gx-3 justify-content-center m-0">
				<div className="col-12 col-md-8 col-xl-9 px-0 px-md-4">
					{/* למסכים קטנים בלבד */}
					<div className="d-md-none d-flex justify-content-between mb-3">
						<button className="btn btn-outline-secondary" onClick={() => setIsFilterOpen(!isFilterOpen)}>
							<i className="bi bi-funnel"> {isFilterOpen ? "close" : "filter"}</i>
						</button>

						<button className="btn btn-primary position-relative" onClick={() => setIsCartOpen(!isCartOpen)}>
							{!isCartOpen ? <i className="bi bi-cart"></i> : <i className="bi bi-x"></i>}

							{/* נקודה אדומה – תופיע רק כשהעגלה סגורה וכשיש שם משהו */}
							{!isCartOpen && cartItems?.length > 0 && (
								<span
									className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
									style={{ width: "12px", height: "12px" }}
								></span>
							)}
						</button>
					</div>

					<div className={`${isFilterOpen ? "" : "d-none d-md-flex"} d-flex justify-content-between align-items-stretch`}>
						<FilterBar filters={filters} maxPrice={maxPrice} categories={categories} handleChange={handleChange} />

						<button className="btn d-none d-md-block btn-primary btn-lg mb-3 px-4 position-relative" onClick={() => setIsCartOpen(!isCartOpen)}>
							{!isCartOpen ? <i className="bi bi-cart"></i> : <i className="bi bi-x"></i>}

							{/* נקודה אדומה – תופיע רק כשהעגלה סגורה וכשיש שם משהו */}
							{!isCartOpen && cartItems.length > 0 && (
								<span
									className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
									style={{ width: "20px", height: "20px" }}
								></span>
							)}
						</button>
					</div>

					<div className="max-vh-80 overflow-y-scroll overflow-x-hidden myStyle-scroll-area pe-2">
						<div className="row">
							{filteredProducts.map((product) => (
								<div key={product.id} className="col-12 col-md-6 col-xl-3 mb-4">
									<Product product={product} />
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="d-none d-md-block col-12 col-md-4 col-xl-3">
					{isCartOpen && (
						<div className="myStyle-animit-right">
							<Cart />
						</div>
					)}
				</div>

				{/* למסכים קטנים בלבד */}
				{isCartOpen && (
					<div className="d-md-none d-flex mobile-menu-bottom show rounded-top-4 myStyle-animit-up">
						<div className="myStyle-animit-up w-100">
							<Cart />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default ProductsCatalog;
