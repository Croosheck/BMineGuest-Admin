import "../reservations/ReservationListItem.css";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import Logout from "../../assets/icons/logout.svg";

function Navbar({ onLogout, name }) {
	const activeClass = "navbar-button navbar-button-active button-loggedin";
	const dropdownActiveClass = "nav-dropContent-button nav-dropbtn-active";

	// Production Helper
	// async function addExtraHandler() {
	// 	const docRef = doc(db, "extras", "freshFlowers");

	// 	await setDoc(docRef, {
	// 		xAvailability: true,
	// 		xFilename: "freshFlowers.png",
	// 		xName: "Fresh Flowers",
	// 		xPicked: false,
	// 	});
	// }

	return (
		<div className="navbar-container">
			<div className="navbar-button restaurant-logo">
				{name ? name : "Restaurant Name"}
			</div>
			{/* Production Helper */}
			{/* <button onClick={() => addExtraHandler()}>CLICK</button> */}
			<NavLink
				to="/reservations"
				className={(navData) =>
					navData.isActive ? activeClass : "navbar-button button-loggedin"
				}
			>
				Reservations
			</NavLink>

			<div className="navbar-manager">
				<div className="nav-dropdown">
					<button className="nav-dropbtn">Manage</button>
					<div className="nav-dropdown-content">
						<div className="nav-dropdown-content-btns-inner-container"></div>
						<NavLink
							to="/extras"
							className={(navData) =>
								navData.isActive
									? dropdownActiveClass
									: "nav-dropContent-button"
							}
						>
							Extras
						</NavLink>
						<NavLink
							to="/restaurant"
							className={(navData) =>
								navData.isActive
									? dropdownActiveClass
									: "nav-dropContent-button"
							}
						>
							Restaurant
						</NavLink>
					</div>
				</div>
			</div>
			<button
				className="navbar-button button-loggedin logout-button"
				onClick={onLogout}
			>
				<img src={Logout} alt="Logout Icon" />
			</button>
		</div>
	);
}

export default Navbar;
