import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import MyBubble from "../../../components/MyBubble";

function Product({ product }) {
	const loggedUser = useSelector((state) => state.common.loggedUser);

	const quantityInCart = useSelector((state) => state.customer.cartItems.find((item) => item.id === product.id))?.quantity || 0;

	const dispatch = useDispatch();

	const [isBubbleOpen, setIsBubbleOpen] = useState(false);

	const isOutOfStock = product.inStock === 0;

	return (
		<div className="card shadow-sm text-center h-100 position-relative">
			{isOutOfStock && <div className="diagonal-ribbon">OUT OF STOCK</div>}

			{product.picLink && (
				<div className="ratio ratio-4x3">
					<img src={product.picLink} className="card-img-top object-fit-cover" alt={product.title} />
				</div>
			)}

			<div className="card-body">
				<h5 className="card-title">{product.title}</h5>

				<div className="overflow-y-auto myStyle-scroll-area" style={{ height: "3rem" }}>
					<p className="card-text text-muted mb-0">{product.description}</p>
				</div>

				<div className="my-3">
					<div className="text-center text-muted small">
						<span>
							<strong>Price:</strong> {product.price}$
						</span>
						<span className="mx-2">|</span>
						<span>
							<strong>In Stock:</strong> {product.inStock}
						</span>
						<span className="mx-2">|</span>
						<span className="bubble-wrapper text-decoration-underline" onMouseOver={() => setIsBubbleOpen(true)} onMouseOut={() => setIsBubbleOpen(false)}>
							<strong>Purchased:</strong> {product.totalPurchased}
							{isBubbleOpen && (
								<MyBubble
									fields={[
										{ key: "fullName", label: "Buyer Name" },
										{ key: "purchasedQuantity", label: "Qty" },
									]}
									items={product.users.map((user) => (user.id === loggedUser.id ? { ...user, fullName: `${user.fullName} (You)` } : user))}
									myKey={`buyers-${product.id}`}
									position="bottom-100 translate-middle-x"
								/>
							)}
						</span>
					</div>
				</div>
			</div>

			<div className="card-footer py-3 d-flex justify-content-center align-items-center gap-2">
				<button
					className="btn btn-outline-secondary rounded-circle"
					onClick={() =>
						dispatch({
							type: "DEC_CART_ITEM",
							payload: {
								id: product.id,
								price: product.price,
							},
						})
					}
					title="Dec"
					disabled={quantityInCart === 0 || isOutOfStock}
					style={{ width: "2.5rem", height: "2.5rem" }}
				>
					–
				</button>

				<span className="fw-bold text-center" style={{ display: "inline-block", minWidth: "3ch" }}>
					{quantityInCart}
				</span>

				<button
					className="btn btn-outline-secondary rounded-circle"
					onClick={() =>
						dispatch({
							type: "INC_CART_ITEM",
							payload: {
								id: product.id,
								title: product.title,
								price: product.price,
								inStock: product.inStock,
							},
						})
					}
					title="Inc"
					disabled={quantityInCart >= product.inStock || isOutOfStock}
					style={{ width: "2.5rem", height: "2.5rem" }}
				>
					+
				</button>
			</div>
		</div>
	);
}

export default Product;
