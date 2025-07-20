import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import MyForm from "../../components/MyForm";

const SERVER_BASE_URL = "http://localhost:3000";

function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleSubmitLogin = async (e, { username, password }) => {
		e.preventDefault();

		if (!username || !password) {
			alert("Please enter username and password");
			navigate("/login");
			return;
		}

		try {
			const response = await axios.post(`${SERVER_BASE_URL}/auth/login`, { username, password });

			const { token } = response.data;
			dispatch({ type: "SET_TOKEN", payload: token });
			sessionStorage.setItem("token", token);

			const { loggedUser } = response.data;
			dispatch({ type: "SET_LOGGED_USER", payload: loggedUser });

			navigate(`/${loggedUser.role}`);
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
							<h1 className="card-title mb-2">Login</h1>
							<h5 className="card-subtitle text-muted mb-3">Enter your login details</h5>
							<MyForm
								inputs={[
									{ name: "username", label: "Username", type: "text", required: true },
									{ name: "password", label: "Password", type: "password", required: true },
								]}
								handleSubmit={handleSubmitLogin}
								buttons={[{ type: "submit", title: "Login", color: "primary" }]}
								myKey="login"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
