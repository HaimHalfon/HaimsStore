import React, { useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useAxiosWithToken } from "../../hooks/useAxiosWithToken";

import MyForm from "../../components/MyForm";

function Profile() {
	const token = useSelector((state) => state.common.token);
	const loggedUser = useSelector((state) => state.common.loggedUser);
	const dispatch = useDispatch();

	const axiosWithToken = useAxiosWithToken(token);

	const handleSubmitUpdateUser = async (e, { id, fullName, password, allowOthers }) => {
		e.preventDefault();

		if (loggedUser.fullName === fullName && loggedUser.allowOthers === allowOthers && !password?.trim()) {
			alert("לא בוצעו אף שינויים");
			return;
		}

		if (!window.confirm("Are you sure you want to update your details?")) return "notConfirm";

		let updateData;

		if (!password?.trim()) {
			updateData = { fullName, allowOthers };
		} else {
			updateData = { fullName, password, allowOthers };
		}

		try {
			const { data } = await axiosWithToken.put(`/users/${id}`, updateData);
			dispatch({ type: "UPDATE_LOGGED_USER", payload: { fullName: data.fullName, allowOthers: data.allowOthers } });

			const productsRes = await axiosWithToken.get("/products/with-allowed-users");
			dispatch({ type: "SET_PRODUCTS", payload: productsRes.data });
		} catch (err) {
			console.error("Server error:", err);
			alert("The server says: " + (err?.response?.data?.message || "Unknown error"));
		}
	};

	return (
		<div className="container">
			<div className="row gx-4 justify-content-center">
				<div className="col-12 col-md-9 col-xl-6">
					<div className="card shadow-sm myStyle-animit-down">
						<div className="card-body p-3 p-md-4">
							<h1 className="card-title mb-2">Profile Manage</h1>
							<h5 className="card-subtitle text-muted mb-3">Edit your details</h5>
							<MyForm
								inputs={[
									{ name: "id", type: "hidden", value: loggedUser.id },
									{ name: "fullName", label: "Full Name", type: "text", value: loggedUser.fullName },
									{ name: "username", label: "Username", type: "text", value: loggedUser.username, disabled: true },
									{ name: "password", label: "Password", type: "password" },
									{ name: "allowOthers", label: "Allow others to see my orders", type: "checkbox", value: loggedUser.allowOthers },
								]}
								handleSubmit={handleSubmitUpdateUser}
								buttons={[{ type: "submit", title: "Update my details", color: "success" }]}
								myKey="userProfile"
								showCancelButton={true}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
