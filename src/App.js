import "./App.css";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "./firebase";

import { useEffect, useState } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/auth/Login";
import ReservationsList from "./components/reservations/ReservationsList";
import Navbar from "./components/UI/Navbar";
import ManageExtras from "./components/manager/extras/ManageExtras";
import ManageRestaurant from "./components/manager/restaurant/ManageRestaurant";
import ManageTables from "./components/manager/tables/ManageTables";

import {
	clearRestaurantData,
	getRestaurant,
	realTimeReservations,
} from "./redux/slices/restaurant";
import { useDispatch, useSelector } from "react-redux";

function App() {
	const dispatch = useDispatch();
	const [isLoggedIn, setIsLoggedIn] = useState({
		loaded: false,
		loggedIn: false,
	});
	const { currentRestaurant } = useSelector((state) => state.restaurantReducer);
	const [restaurantEmail, setRestaurantEmail] = useState("");

	useEffect(() => {
		getAuth().onAuthStateChanged((user) => {
			if (!user) {
				setIsLoggedIn({ loaded: true, loggedIn: false });
			}
			if (user) {
				dispatch(getRestaurant());
				setRestaurantEmail(user.email);
				setIsLoggedIn({ loaded: true, loggedIn: true });
			}
		});
	}, [dispatch]);

	async function logoutHandler() {
		if (!isLoggedIn.loggedIn) return;

		dispatch(realTimeReservations([]));
		dispatch(clearRestaurantData());
		signOut(auth);
	}

	if (!isLoggedIn.loaded) {
		return (
			<div className="app-container">
				<div className="inner-container login-container">
					<div className="loading-container ">LOADING...</div>
				</div>
			</div>
		);
	}

	if (!isLoggedIn.loggedIn) {
		return (
			<div className="app-container">
				<div className="inner-container login-container">
					<div className="box-container">
						<Routes>
							<Route path="/*" element={<Navigate replace to="/login" />} />
							<Route path="/login" element={<Login />} />
						</Routes>
					</div>
				</div>
			</div>
		);
	}

	if (isLoggedIn.loggedIn) {
		return (
			<div className="app-container">
				<div className="inner-container">
					<Navbar
						email={restaurantEmail}
						name={currentRestaurant?.name}
						onLogout={logoutHandler}
					/>
					<Routes>
						<Route
							path="/*"
							element={<Navigate replace to="/reservations" />}
						/>
						<Route path="/reservations" element={<ReservationsList />} />
						<Route path="/tables" element={<ManageTables />} />
						<Route path="/extras" element={<ManageExtras />} />
						<Route path="/restaurant" element={<ManageRestaurant />} />
					</Routes>
				</div>
			</div>
		);
	}
}

export default App;
