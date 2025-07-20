import React, { useMemo } from "react";
import { Outlet } from "react-router-dom";

import MyNavbar from "../components/MyNavbar";

function GuestLayout() {
	return (
		<>
			<MyNavbar
				logo="Haim's Store"
				navLinks={[
					{ title: "Login", name: "login", ref: "/guest/login" },
					{ title: "Register", name: "register", ref: "/guest/register" },
				]}
			/>

			<Outlet />
		</>
	);
}

export default GuestLayout;
