import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import MyTable from "../../components/MyTable";
import { formatDateShort } from "../../utils/dateHelper";

function Customers() {
	const users = useSelector((state) => state.admin.users);

	return (
		<div className="container">
			<div className="row gx-4 justify-content-center">
				<div className="col-12 col-md-12 col-xl-7">
					<div className="card shadow-sm myStyle-animit-down">
						<div className="card-body p-3 p-md-4">
							<h1 className="card-title mb-2">Customers</h1>
							<h5 className="card-subtitle text-muted mb-3">All customers in the system</h5>
							<div className="max-vh-75 overflow-y-scroll myStyle-scroll-area pe-2">
								<MyTable
									fields={[
										{ key: "fullName", label: "Full Name" },
										{ key: "joinedAt", label: "Joined At" },
										{
											key: "products",
											label: "Products Purchased",
											render: (products, userId) => (
												<div>
													<MyTable
														fields={[
															{ key: "title", label: "Product" },
															{ key: "purchasedQuantity", label: "Qty" },
														]}
														items={products}
														myKey={`${userId}-products`}
													/>
												</div>
											),
										},
									]}
									items={users.map((user) => ({ ...user, joinedAt: formatDateShort(user.joinedAt) }))}
									myKey="customers"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Customers;
