import "./ReservationsList.css";
import { getAuth } from "firebase/auth";
import {
	collection,
	onSnapshot,
	query,
	doc,
	deleteDoc,
	getDocs,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	pickedReservation,
	realTimeReservations,
} from "../../redux/slices/restaurant";
import ReservationListItem from "./ReservationListItem";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { changeReservationStatus } from "../../util/storage";
import { getDownloadURL, ref } from "firebase/storage";

function ReservationsList() {
	const [loaded, setLoaded] = useState(false);
	const [extrasImgs, setExtrasImgs] = useState({});

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

		const qExtrasImgs = query(collection(db, "extras"));
		async function getAvailableExtras() {
			setExtrasImgs({});

			const querySnapshot = await getDocs(qExtrasImgs);

			querySnapshot.forEach(async (doc) => {
				const extraImg = ref(storage, `extras/${doc.id}.png`);

				const extraImgUrl = await getDownloadURL(extraImg);

				setExtrasImgs((prev) => ({ ...prev, [doc.id]: extraImgUrl }));

				// //For default state (to reset picked item highlight)
				// setAvailableExtras((prev) => [
				// 	...prev,
				// 	{ ...doc.data(), xUrl: extraImgUrl },
				// ]);

				// dispatch(
				// 	setAvailableExtrasGlobal({ ...doc.data(), xUrl: extraImgUrl })
				// );
			});
		}
		getAvailableExtras();
	}, [dispatch]);

	async function deleteReservation(collection, uid, filename) {
		await deleteDoc(doc(db, collection, uid, "reservations", filename));
	}

	async function deleteReservationHandler(reservation) {
		// Delete reservation for the restaurant
		await deleteReservation(
			"restaurants",
			auth.currentUser.uid,
			reservation.filename
		);

		// Delete reservation for the client
		await deleteReservation(
			"users",
			reservation.clientsUid,
			reservation.filename
		);
	}

	if (!loaded) {
		return <div className="empty-list-loading">Loading...</div>;
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
					extras={reservation.extras}
					extrasImgs={extrasImgs}
					confirmed={reservation.confirmed}
					cancelled={reservation.cancelled}
					callRequest={reservation.callRequest}
					onDelete={() => deleteReservationHandler(reservation)}
					onConfirm={() =>
						changeReservationStatus(false, reservation, true, false)
					}
					onCancel={() =>
						changeReservationStatus(false, reservation, false, true)
					}
					onCallRequest={() =>
						changeReservationStatus(true, reservation, false, false)
					}
					reservationPicked={reservation.picked}
					onClick={() => dispatch(pickedReservation(reservation.filename))}
				/>
			</CSSTransition>
		);
	});

	if (itemsList.length === 0 && loaded) {
		return (
			<div className="reservationsList-container reservations-no-data">
				No active reservations yet.
			</div>
		);
	}

	const reversedItemsList = itemsList.slice(0).reverse();

	return (
		<div className="reservationsList-container">
			{/* <div style={{ background: "#cccccc", height: 100, width: "100%" }}></div> */}
			<TransitionGroup className="reservations-list" component="ul">
				{reversedItemsList}
			</TransitionGroup>
		</div>
	);
}

export default ReservationsList;
