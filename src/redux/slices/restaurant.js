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

const name = "restaurant";
const initialState = createInitialState();
const reducers = createReducers();
const extraReducers = createExtraReducers(getRestaurant);

export const restaurantSlice = createSlice({
	name,
	initialState,
	reducers,
	extraReducers,
});

function createInitialState() {
	return {
		currentRestaurant: {},
		reservationData: {
			extras: [],
			table: {},
		},
		reservationsList: [],
		availableExtrasGlobal: [],
		newTableBase64ImageData: {
			img: "",
			imgExt: "",
		},
	};
}
function createReducers() {
	return {
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
		setNewTableBase64ImageData: (state, { payload }) => {
			state.newTableBase64ImageData = payload;
		},
	};
}
function createExtraReducers(thunk) {
	return (builder) => {
		const { fulfilled, pending } = thunk;

		builder.addCase(fulfilled, (state, { payload }) => {
			state.currentRestaurant = payload;
		});
		builder.addCase(pending, (state) => {
			state.currentRestaurant = null;
		});
	};
}

export const {
	realTimeReservations,
	pickedReservation,
	clearRestaurantData,
	setAvailableExtrasGlobal,
	resetAvailableExtrasGlobal,
	pickedExtra,
	resetPickedExtras,
	setNewTableBase64ImageData,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
