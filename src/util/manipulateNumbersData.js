import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export async function updateDataFields(updateData) {
	await updateDoc(doc(db, "restaurants", auth.currentUser.uid), updateData);
}
