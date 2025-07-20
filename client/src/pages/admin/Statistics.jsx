import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";

import MyChart from "../../components/MyChart";
import MyForm from "../../components/MyForm";

function Statistics() {
	const categories = useSelector((state) => state.admin.categories);
	const users = useSelector((state) => state.admin.users);

	const [currentCustomerId, setCurrentCustomerId] = useState(users[0]?.id || "");

	const categoryChartData = useMemo(() => {
		return categories.map((category) => ({ name: category.title, value: category.totalPurchased }));
	}, [categories]);

	const customerChartData = useMemo(() => {
		const user = users.find((user) => user.id === currentCustomerId);
		return user?.products.map((product) => ({ name: product.title, value: product.purchasedQuantity })) || [];
	}, [users, currentCustomerId]);

	const handleChange = (x) => {
		setCurrentCustomerId(x.customerId);
	};

	return (
		<div className="container">
			<div className="row gx-4 justify-content-center">
				<div className="col-12 col-md-12 col-xl-8">
					<div className="card shadow-sm myStyle-animit-down">
						<div className="card-body p-3 p-md-4">
							<h1 className="card-title mb-2">Statistic</h1>
							<div className="max-vh-80 overflow-y-scroll overflow-x-hidden myStyle-scroll-area pe-2">
								<div className="row m-0">
									<div className="col-12 col-md-6 p-0 pb-3 p-md-0 pe-md-3 border-switch">
										<h5 className="card-subtitle text-muted mb-3">Total quantity of products sold by category</h5>
										<MyChart type="pie" data={categoryChartData} />
									</div>

									<div className="col-12 col-md-6 p-0 pt-3 p-md-0 ps-md-3">
										<h5 className="card-subtitle text-muted mb-3">Products quantity per customer</h5>

										<MyForm
											inputs={[
												{
													name: "customerId",
													label: "Customer",
													type: "select",
													value: currentCustomerId,
													selectOptions: users.map((user) => ({
														value: user.id,
														label: user.fullName,
													})),
												},
											]}
											handleChange={handleChange}
											myKey="filterCustomer"
										/>

										<MyChart type="bar" data={customerChartData} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Statistics;
