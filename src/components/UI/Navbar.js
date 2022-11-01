import "./Navbar.css";
import React from "react";
import { NavLink } from "react-router-dom";

function Navbar({ onLogout, name }) {
	const activeClass = "navbar-button navbar-button-active button-loggedin";

	return (
		<div className="navbar-container">
			<div className="navbar-button restaurant-logo">[restaurant name]</div>
			<NavLink
				to="/reservations"
				className={(navData) =>
					navData.isActive ? activeClass : "navbar-button button-loggedin"
				}
			>
				Reservations
			</NavLink>
			<NavLink
				to="/manager"
				className={(navData) =>
					navData.isActive ? activeClass : "navbar-button button-loggedin"
				}
			>
				Manager
			</NavLink>
			<button
				className="navbar-button button-loggedin logout-button"
				onClick={onLogout}
			>
				Logout
			</button>
		</div>
	);
}

export default Navbar;
