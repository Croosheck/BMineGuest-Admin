import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export const getRestaurant = createAsyncThunk(
	"restaurant/getRestaurant",
	async () => {
		const docRef = doc(db, "restaurants", auth.currentUser.uid);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const { email, name, tables, extras } = docSnap.data();

			return { email, name, tables, extras };
		}
	}
);

export const restaurantSlice = createSlice({
	name: "restaurant",
	initialState: {
		currentRestaurant: "",
		reservationData: {
			extras: [],
			table: {},
		},
		reservationsList: [],
	},
	reducers: {
		realTimeReservations: (state, { payload }) => {
			state.reservationsList = payload;
		},
		clearRestaurantData: (state) => {
			state.currentRestaurant = "";
		},
	},
	extraReducers: {
		[getRestaurant.fulfilled]: (state, { payload }) => {
			state.currentRestaurant = payload;
		},
	},
});

export const { realTimeReservations, clearRestaurantData } =
	restaurantSlice.actions;

export default restaurantSlice.reducer;
