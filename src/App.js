import "./App.css";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Login from "./components/auth/Login";
import ReservationsList from "./components/reservations/ReservationsList";
import Navbar from "./components/UI/Navbar";
import Manager from "./components/manager/Manager";

import {
	clearRestaurantData,
	getRestaurant,
	realTimeReservations,
} from "./redux/slices/restaurant";

import { Routes, Route, Navigate } from "react-router-dom";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState({
		loaded: false,
		loggedIn: false,
	});

	const { name } = useSelector(
		(state) => state.restaurantReducer.currentRestaurant
	);

	const dispatch = useDispatch();

	useEffect(() => {
		getAuth().onAuthStateChanged((user) => {
			if (!user) {
				setIsLoggedIn({ loaded: true, loggedIn: false });
			}
			if (user) {
				setIsLoggedIn({ loaded: true, loggedIn: true });
			}
		});

		dispatch(getRestaurant());
	}, [dispatch]);

	async function logoutHandler() {
		if (!isLoggedIn.loggedIn) return;

		const auth = getAuth();

		dispatch(realTimeReservations([]));
		dispatch(clearRestaurantData());
		signOut(auth);
	}

	if (!isLoggedIn.loaded) {
		return (
			<div className="app-container">
				<div className="inner-container login-container">
					<div className="box-container ">LOADING...</div>
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
					<Navbar name={name} onLogout={logoutHandler} />
					<Routes>
						<Route
							path="/*"
							element={<Navigate replace to="/reservations" />}
						/>
						<Route path="/reservations" element={<ReservationsList />} />
						<Route path="/manager" element={<Manager />} />
					</Routes>
				</div>
			</div>
		);
	}
}

export default App;
