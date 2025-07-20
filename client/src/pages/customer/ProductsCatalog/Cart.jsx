import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAxiosWithToken } from "../../../hooks/useAxiosWithToken";

function Cart() {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.common.token);
	const loggedUser = useSelector((state) => state.common.loggedUser);
	const cartItems = useSelector((state) => state.customer.cartItems);

	const axiosWithToken = useAxiosWithToken(token);

	const cartTotal = useMemo(() => {
		return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
	}, [cartItems]);

	const handleAddOrder = async () => {
		if (cartItems.length === 0) {
			alert("Please add some items to cart");
			return;
		}

		try {
			await axiosWithToken.post("/orders", {
				user: { id: loggedUser.id },
				products: cartItems.map((item) => ({
					product: { id: item.id },
					purchasedQuantity: item.quantity,
				})),
			});

			dispatch({ type: "SET_CART_ITEMS", payload: [] });

			const ordersRes = await axiosWithToken.get("/orders/full-products");
			dispatch({ type: "SET_ORDERS", payload: ordersRes.data });

			const productsRes = await axiosWithToken.get("/products/with-allowed-users");
			dispatch({ type: "SET_PRODUCTS", payload: productsRes.data });

			alert("Thank you for your purchase :)");
		} catch (err) {
			console.error("Server error:", err);
			alert("The server says: " + (err?.response?.data?.message || "Unknown error"));
		}
	};

	return (
		<div className="card shadow-sm">
			<div className="card-body p-3 p-md-4">
				<h1 className="card-title mb-2">Cart</h1>
				<h5 className="card-subtitle text-muted mb-3">Your selected items</h5>
				<div className="d-flex flex-column justify-content-between ">
					<div className="vh-55 overflow-y-scroll myStyle-scroll-area pe-2 mb-4">
						<ul className="list-group border-0">
							{cartItems.map((item, index) => (
								<li key={`cart-${index}`} className="list-group-item d-flex justify-content-between align-items-center">
									<div className="w-65">
										<span>
											<b>Title:</b> {item.title}
										</span>
										<br />
										<span>
											<b>Qty:</b> {item.quantity}
										</span>
										<br />
										<span>
											<b>Total:</b> {item.totalPrice}$
										</span>
									</div>

									<div className="d-flex">
										<button
											className="btn btn-sm btn-outline-secondary me-2"
											onClick={() =>
												dispatch({
													type: "INC_CART_ITEM",
													payload: {
														id: item.id,
														price: item.price,
													},
												})
											}
											title="Inc"
											disabled={item.quantity >= item.inStock}
										>
											<i className="bi bi-plus"></i>
										</button>

										<button
											className="btn btn-sm btn-outline-secondary me-2"
											onClick={() =>
												dispatch({
													type: "DEC_CART_ITEM",
													payload: {
														id: item.id,
														price: item.price,
													},
												})
											}
											title="Dec"
										>
											<i className="bi bi-dash"></i>
										</button>

										<button
											className="btn btn-sm btn-outline-danger"
											onClick={() => {
												dispatch({ type: "DELETE_CART_ITEM", payload: { id: item.id } });
											}}
											title="Delete"
										>
											<i className="bi bi-trash"></i>
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
					<button className={`btn btn-primary ${cartItems.length === 0 ? "disabled" : ""}`} onClick={handleAddOrder} title="Delete">
						Cart Total: {cartTotal}$
						<br />
						Add Order
					</button>
				</div>
			</div>
		</div>
	);
}

export default Cart;
