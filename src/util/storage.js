import { auth, db, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import {
	doc,
	collection,
	getDocs,
	query,
	onSnapshot,
	updateDoc,
	arrayUnion,
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

	onSnapshot(q, (querySnapshot) => {
		availableRestaurants = [];
		querySnapshot.forEach((doc) => {
			availableRestaurants.push(doc.data());
		});
	});

	return availableRestaurants;
}

export async function changeReservationStatus(
	callRequest,
	reservation,
	confirmed,
	cancelled
) {
	await updateDoc(
		doc(
			db,
			"restaurants",
			auth.currentUser.uid,
			"reservations",
			reservation.filename
		),
		{
			confirmed: confirmed,
			cancelled: cancelled,
			callRequest: callRequest,
		}
	);

	await updateDoc(
		doc(
			db,
			"users",
			reservation.clientsUid,
			"reservations",
			reservation.filename
		),
		{
			confirmed: confirmed,
			cancelled: cancelled,
			callRequest: callRequest,
		}
	);
}

export default async function uploadFile(image, type, data) {
	let imageRef;
	const restaurantRef = doc(db, "restaurants", auth.currentUser.uid);

	if (type === "addTable") {
		imageRef = ref(
			storage,
			`restaurants/${auth.currentUser.uid}/tables/${data.tId}`
		);

		// Inserts a new table object into firebase restaurant doc array
		// await updateDoc(restaurantRef, {
		// 	tables: arrayUnion(data),
		// });
	}

	const response = await fetch(image);
	const blob = await response.blob();

	// Files uploading to Firebase Storage
	await uploadBytes(imageRef, blob);

	return { imageRef, blob };
}
