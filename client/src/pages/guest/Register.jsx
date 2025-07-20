import { useNavigate } from "react-router-dom";
import axios from "axios";

import MyForm from "../../components/MyForm";

const SERVER_BASE_URL = "http://localhost:3000";

function Register() {
	const navigate = useNavigate();

	const handleSubmitRegister = async (e, { fullName, username, password, allowOthers, role }) => {
		e.preventDefault();

		if (!username || !password) {
			alert("Please enter Username and Password");
			return;
		}

		try {
			await axios.post(`${SERVER_BASE_URL}/auth/register`, {
				fullName,
				username,
				password,
				allowOthers,
				role: role ? "admin" : "customer",
			});
			alert("The user has registered successfully");
			navigate("/login");
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
							<h1 className="card-title mb-2">Register</h1>
							<h5 className="card-subtitle text-muted mb-3">Enter your details</h5>
							<MyForm
								inputs={[
									{ name: "fullName", label: "Full Name", type: "text" },
									{ name: "username", label: "Username", type: "text", required: true },
									{ name: "password", label: "Password", type: "password", required: true },
									{ name: "allowOthers", label: "Allow others to see my orders", type: "checkbox" },
									{ name: "role", label: "Admin", type: "switch" },
								]}
								handleSubmit={handleSubmitRegister}
								buttons={[{ type: "submit", title: "Register", color: "primary" }]}
								myKey="register"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;
