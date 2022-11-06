import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

function Navbar({ onLogout, name }) {
	const activeClass = "navbar-button navbar-button-active button-loggedin";

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
			<div
				className="navbar-button restaura
			//Production Helpernt-logo"
			>
				[restaurant name]
			</div>
			{/* <button onClick={() => addExtraHandler()}>CLICK</button> */}
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
