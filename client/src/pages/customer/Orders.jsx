import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { formatDateShort } from "../../utils/dateHelper";

import MyTable from "../../components/MyTable";

function Orders() {
	const orders = useSelector((state) => state.customer.orders);

	return (
		<div className="container">
			<div className="row gx-4 justify-content-center">
				<div className="col-12 col-md-12 col-xl-9">
					<div className="card shadow-sm myStyle-animit-down">
						<div className="card-body p-3 p-md-4">
							<h1 className="card-title mb-2">My Orders</h1>
							<h5 className="card-subtitle text-muted mb-3">All orders</h5>
							<div className="max-vh-75 overflow-y-scroll myStyle-scroll-area pe-2">
								<MyTable
									fields={[
										{ key: "id", label: "Order Id" },
										{ key: "orderDate", label: "Order Date" },
										{ key: "totalPrice", label: "Total Price" },
										{
											key: "products",
											label: "Products Purchased",
											render: (products, orderId) => (
												<div>
													<MyTable
														fields={[
															{ key: "product", nestedKey: "title", label: "Product" },
															{ key: "purchasedQuantity", label: "Qty" },
															{ key: "priceAtPurchase", label: "Price At Purchase" },
														]}
														items={products.map((product) => ({ ...product, priceAtPurchase: `${product.priceAtPurchase}$` }))}
														myKey={`${orderId}-products`}
													/>
												</div>
											),
										},
									]}
									items={orders.map((order) => ({
										...order,
										totalPrice: `${order.totalPrice}$`,
										orderDate: formatDateShort(order.orderDate),
									}))}
									myKey="orders"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Orders;
