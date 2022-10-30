import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
	doc,
	collection,
	setDoc,
	getDocs,
	query,
	onSnapshot,
} from "firebase/firestore";

export async function getReservations() {
	const reservationsQuery = query(
		collection(db, "restaurants", auth.currentUser.uid, "reservations")
	);
	const querySnapshot = await getDocs(reservationsQuery);

	const reservationsData = [];

	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		reservationsData.push(doc.data());
	});

	return reservationsData;
}

export function getRealTimeReservations() {
	let availableRestaurants;

	const q = query(
		collection(db, "restaurants", auth.currentUser.uid, "reservations")
	);

	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		availableRestaurants = [];
		querySnapshot.forEach((doc) => {
			availableRestaurants.push(doc.data());
		});
	});

	return availableRestaurants;
}
