import { auth, db, storage } from "../firebase";
import {
	deleteObject,
	ref,
	uploadBytes,
	uploadBytesResumable,
} from "firebase/storage";
import {
	doc,
	collection,
	getDocs,
	query,
	onSnapshot,
	updateDoc,
	arrayUnion,
	FieldValue,
	arrayRemove,
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
	let uploadStatus;

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
	const uploadTask = uploadBytesResumable(imageRef, blob);

	uploadTask.on(
		"state_changed",
		(snapshot) => {},
		(error) => {
			// Handle unsuccessful uploads
		},
		() => {
			// Handle successful uploads on complete
			const storageTimeout = setTimeout(async () => {
				await updateDoc(restaurantRef, {
					tables: arrayUnion(data),
				});
				return clearTimeout(storageTimeout);
			}, 500);
		}
	);

	return { imageRef, blob, uploadStatus, uploadTask };
}

export function deleteTableImage({
	filename = String(),
	successCallback = () => {},
	data = {},
}) {
	const tableDataRef = doc(db, `restaurants`, auth.currentUser.uid);

	const tableImageRef = ref(
		storage,
		`restaurants/${auth.currentUser.uid}/tables/${filename}`
	);

	// Delete the file
	deleteObject(tableImageRef)
		.then(async () => {
			// File deleted successfully
			await updateDoc(tableDataRef, {
				tables: arrayRemove(data),
			});

			successCallback();
		})
		.catch((error) => {
			// Uh-oh, an error occurred!
			console.log(error);
		});
}

export async function updateTable({
	arrayOldData = [],
	itemId = "",
	updatedItem = {},
}) {
	const itemToUpdateIndex = arrayOldData.findIndex(
		(item) => item.tId === itemId
	);

	const updatedArray = [...arrayOldData];
	updatedArray[itemToUpdateIndex] = updatedItem;

	const restaurantRef = doc(db, "restaurants", auth.currentUser.uid);

	await updateDoc(restaurantRef, {
		tables: updatedArray,
	});
}
