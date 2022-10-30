import "./ReservationsList.css";
import { getAuth } from "firebase/auth";
import {
	collection,
	onSnapshot,
	query,
	doc,
	deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { realTimeReservations } from "../../redux/slices/restaurant";
import ReservationListItem from "./ReservationListItem";
import { TransitionGroup, CSSTransition } from "react-transition-group";

function ReservationsList() {
	const [loaded, setLoaded] = useState(false);

	const { reservationsList } = useSelector((state) => state.restaurantReducer);

	const dispatch = useDispatch();

	useEffect(() => {
		getAuth().onAuthStateChanged((user) => {
			if (!user) return;
		});

		// Realtime
		const q = query(
			collection(db, "restaurants", auth.currentUser.uid, "reservations")
		);
		onSnapshot(q, (querySnapshot) => {
			const realTimeReservationsData = [];
			querySnapshot.forEach((doc) => {
				realTimeReservationsData.push(doc.data());
			});

			// const reversedRealTimeReservationsData = realTimeReservationsData
			// 	.slice(0)
			// 	.reverse();

			setLoaded(true);
			dispatch(realTimeReservations(realTimeReservationsData));
		});
	}, [dispatch]);

	async function deleteReservatio(collection, uid, filename) {
		await deleteDoc(doc(db, collection, uid, "reservations", filename));
	}

	async function deleteReservationHandler(reservation) {
		// Delete reservation for the restaurant
		await deleteReservatio(
			"restaurants",
			auth.currentUser.uid,
			reservation.filename
		);

		// Delete reservation for the client
		await deleteReservatio(
			"users",
			reservation.clientsUid,
			reservation.filename
		);
	}

	if (!loaded) {
		return <div className="empty-list">Loading...</div>;
	}

	const itemsList = reservationsList.map((reservation, index) => {
		return (
			<CSSTransition key={reservation.filename} timeout={800} classNames="item">
				<ReservationListItem
					key={index}
					clientsName={reservation.clientsName}
					clientsEmail={reservation.clientsEmail}
					extrasTotalPrice={reservation.extrasTotalPrice}
					reservationDate={reservation.reservationDate}
					table={reservation.table}
					onDelete={() => deleteReservationHandler(reservation)}
				/>
			</CSSTransition>
		);
	});

	if (!itemsList.length > 0 && loaded) {
		return <div className=" empty-list">No reservations yet!</div>;
	}

	const reversedItemsList = itemsList.slice(0).reverse();

	return (
		<div className="reservationsList-container">
			<TransitionGroup className="reservations-list" component="ul">
				{reversedItemsList}
			</TransitionGroup>
		</div>
	);
}

export default ReservationsList;
