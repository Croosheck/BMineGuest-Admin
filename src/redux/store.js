import { configureStore } from "@reduxjs/toolkit";
import restaurantSlice from "./slices/restaurant";

export const store = configureStore({
	reducer: {
		restaurantReducer: restaurantSlice,
	},
});
