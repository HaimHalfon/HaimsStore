import React, { useState } from "react";

import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function MyNavbar({ logo = "LOGO", navLinks = [] }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loggedUser = useSelector((state) => state.common.loggedUser);

	const handleLogout = () => {
		if (!window.confirm("Are you sure you want to sign out?")) return "notConfirm";

		dispatch({ type: "SET_TOKEN", payload: "" });
		dispatch({ type: "SET_LOGGED_USER", payload: null });
		dispatch({ type: "SET_CART_ITEMS", payload: [] });

		navigate("/login");
	};

	return (
		<>
			<nav className="navbar navbar-expand-md navbar-light bg-light px-3 mb-3 border-bottom">
				<div className="container-fluid">
					<div className="d-flex align-items-baseline">
						<Link to="/" className="navbar-brand">
							{logo}
						</Link>

						{loggedUser && loggedUser.role === "admin" && <span className="badge bg-warning text-dark">Admin mode</span>}
					</div>

					{/* למסכים גדולים בלבד */}
					<ul className="navbar-nav d-none d-md-flex mx-auto">
						{navLinks.map((navLink) => {
							const isActive = location.pathname === navLink.ref;
							return (
								<li key={navLink.name} className="nav-item me-3">
									<Link to={navLink.ref} className={`btn btn-outline-secondary rounded-pill px-3 py-1 ${isActive && "active"}`}>
										{navLink.title}
									</Link>
								</li>
							);
						})}
					</ul>

					{/* למסכים קטנים בלבד */}
					<button className="btn d-md-none p-0" onClick={() => setIsMenuOpen(true)}>
						<i className="bi bi-list fs-2" />
					</button>

					{/* למסכים גדולים בלבד */}
					<div className="d-none d-md-flex align-items-center">
						{loggedUser ? (
							<>
								<span className="me-3">
									Hello <b>{loggedUser.fullName}</b>
								</span>
								<button className="btn btn-outline-danger rounded-pill px-3 py-1" onClick={handleLogout}>
									Sign Out
								</button>
							</>
						) : (
							<span className="me-3">Please Login</span>
						)}
					</div>
				</div>
			</nav>

			{/* תפריט צד למסכים קטנים */}
			{isMenuOpen && (
				<div className="mobile-menu-left show rounded-end-4 myStyle-animit-right">
					<button className="close-btn" onClick={() => setIsMenuOpen(false)}>
						<i className="bi bi-x" />
					</button>

					<h3 className="nav-item me-5">
						{loggedUser ? (
							<>
								Hello <br />
								{loggedUser.fullName}
							</>
						) : (
							<>Please Login</>
						)}
					</h3>

					<hr />

					<ul className="navbar-nav">
						{navLinks.map((navLink) => {
							const isActive = location.pathname === navLink.ref;
							return (
								<li key={navLink.name} className="nav-item">
									<Link to={navLink.ref} className={`nav-link ${isActive ? "active fw-bold text-primary" : ""}`} onClick={() => setIsMenuOpen(false)}>
										{navLink.title}
									</Link>
								</li>
							);
						})}
						{loggedUser && (
							<li className="nav-item mt-3">
								<button className="btn btn-outline-danger w-100" onClick={handleLogout}>
									Sign Out
								</button>
							</li>
						)}
					</ul>
				</div>
			)}
		</>
	);
}

export default MyNavbar;
