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
		availableExtrasGlobal: [],
	},
	reducers: {
		realTimeReservations: (state, { payload }) => {
			state.reservationsList = payload.map((reservation) => ({
				...reservation,
				picked: false,
			}));
		},
		pickedReservation: (state, { payload }) => {
			const pickedReservationIndex = state.reservationsList.findIndex(
				(res) => res.filename === payload
			);

			if (state.reservationsList[pickedReservationIndex].picked === true) {
				state.reservationsList[pickedReservationIndex].picked = false;
				return;
			}

			state.reservationsList.map((reservation) => (reservation.picked = false));

			state.reservationsList[pickedReservationIndex].picked = true;
		},
		clearRestaurantData: (state) => {
			state.currentRestaurant = "";
		},
		setAvailableExtrasGlobal: (state, { payload }) => {
			state.availableExtrasGlobal = [...state.availableExtrasGlobal, payload];
		},
		resetAvailableExtrasGlobal: (state) => {
			state.availableExtrasGlobal = [];
		},
		pickedExtra: (state, { payload }) => {
			const pickedExtraIndex = state.availableExtrasGlobal.findIndex(
				(extra) => extra.xName === payload
			);

			state.availableExtrasGlobal[pickedExtraIndex].xPicked = true;
		},
		resetPickedExtras: (state, { payload }) => {
			state.availableExtrasGlobal = [...payload];
		},
	},
	extraReducers: {
		[getRestaurant.fulfilled]: (state, { payload }) => {
			state.currentRestaurant = payload;
		},
	},
});

export const {
	realTimeReservations,
	pickedReservation,
	clearRestaurantData,
	setAvailableExtrasGlobal,
	resetAvailableExtrasGlobal,
	pickedExtra,
	resetPickedExtras,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
