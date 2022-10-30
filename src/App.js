import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Login from "./components/auth/Login";
import ReservationsList from "./components/reservations/ReservationsList";
import Navbar from "./components/UI/Navbar";
import Manager from "./components/manager/Manager";

import {
	clearRestaurantData,
	getRestaurant,
	realTimeReservations,
} from "./redux/slices/restaurant";

import { BrowserRouter, Routes, Route } from "react-router-dom";

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
			} else {
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
				<div className="inner-container">
					<div className="box-container">LOADING...</div>
				</div>
			</div>
		);
	}

	if (!isLoggedIn.loggedIn) {
		return (
			<div className="app-container">
				<div className="inner-container">
					<div className="box-container">
						<Login />
					</div>
				</div>
			</div>
		);
	}

	if (isLoggedIn.loggedIn) {
		return (
			<div className="app-container">
				<BrowserRouter>
					<Navbar name={name} onClick={logoutHandler} />
					<div className="inner-container">
						<Routes>
							<Route path="/" element={<ReservationsList />} />
							<Route path="/reservations" element={<ReservationsList />} />
							<Route path="/manager" element={<Manager />} />
						</Routes>
					</div>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
