import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export async function toggleRestaurantState(updateData) {
	await updateDoc(doc(db, "restaurants", auth.currentUser.uid), updateData);
}
