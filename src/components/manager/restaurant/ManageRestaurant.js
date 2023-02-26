import "./ManageRestaurant.css";
import { useEffect, useState } from "react";
import {
	collection,
	doc,
	getDocs,
	onSnapshot,
	query,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { camelToTitle } from "../../../util/camelToTitle";
import { updateDataFields } from "../../../util/manipulateNumbersData";

import InnerBox from "./InnerBox";
import WeekSchedule from "./week/WeekSchedule";
import WeekDay from "./week/WeekDay";
import { weekScheduleDay } from "../../../util/weekSchedule";
import InnerBoxToggleItem from "./toggle/InnerBoxToggleItem";
import { toggleRestaurantState } from "../../../util/toggleRestaurantState";
import InnerBoxReservationLimitItem from "./limits/reservationLimitItem/InnerBoxReservationLimitItem";
import InnerBoxReservationAdvanceItem from "./limits/reservationAdvanceItem/InnerBoxReservationAdvanceItem";
import TagsInnerContainer from "./tags/TagsInnerContainer";
import InnerBoxCancellationAdvanceItem from "./limits/cancellationAdvanceItem/InnerBoxCancellationAdvanceItem";
import DescriptionItem from "./input/description/DescriptionItem";

const MS_PER_DAY = 86400000;

function ManageRestaurant() {
	const [restaurantData, setRestaurantData] = useState();
	const [openDays, setOpenDays] = useState([]);
	const [toggleData, setToggleData] = useState({
		reservationsEnabled: false,
		tablesFiltering: false,
	});
	const [limitsData, setLimitsData] = useState({
		reservationLimit: "Loading...",
		reservationAdvance: "Loading...",
		cancellationAdvance: "Loading...",
	});
	const [tagsData, setTagsData] = useState({
		availableTags: [],
		pickedTags: [],
	});
	const [inputData, setInputData] = useState({
		description: "",
		phone: "",
		url: "",
	});
	const [submitResult, setSubmitResult] = useState({
		message: null,
		isHold: false,
	});

	useEffect(() => {
		async function getCurrentData() {
			const docRef = doc(db, "restaurants", auth.currentUser.uid);

			const unsub = onSnapshot(docRef, (doc) => {
				//real-time restaurant's data
				setRestaurantData(doc.data());

				//real-time week schedule data
				setOpenDays(doc.data().openDays);

				//real-time toggle data
				for (const item in doc.data()) {
					if (typeof doc.data()[item] === "boolean") {
						setToggleData((prev) => {
							return { ...prev, [item]: doc.data()[item] };
						});
					}
				}

				//real-time limits data
				setLimitsData(() => ({
					reservationLimit: doc.data().reservationLimit,
					reservationAdvance: doc.data().reservationAdvance,
					cancellationAdvance: doc.data().cancellationAdvance,
				}));

				//real-time PICKED tags
				setTagsData((prev) => ({
					availableTags: [...prev.availableTags],
					pickedTags: [...doc.data().restaurantTags],
				}));

				//real-time input data
				setInputData({
					description: doc.data().description,
					phone: doc.data().phone,
					url: doc.data().url,
				});
			});

			// TAGS //
			const qAvailableTags = query(collection(db, "tags"));
			const qAvailableTagsSnapshot = await getDocs(qAvailableTags);

			//real-time AVAILABLE tags
			qAvailableTagsSnapshot.forEach((doc) => {
				//prevent overwritting
				if (
					qAvailableTagsSnapshot.docs.length === tagsData.availableTags.length
				)
					return;

				setTagsData((prev) => ({
					availableTags: [...prev.availableTags, doc.data()],
					pickedTags: [...prev.pickedTags],
				}));
			});
		}

		getCurrentData();
	}, [tagsData.availableTags.length]);

	//Week Schedule
	function switchDayOpenHandler(pickedDay) {
		setOpenDays((prev) => {
			const updatedSchedule = prev.map((dayData) => {
				if (dayData.day === pickedDay.day) {
					dayData.isOpen = !dayData.isOpen;
				}

				return weekScheduleDay(dayData);
			});

			toggleRestaurantState({
				openDays: updatedSchedule,
			});

			return updatedSchedule;
		});
	}

	function reservationsHourHandler(pickedDay, operation) {
		let updatedHours = {
			reservationsOpen: pickedDay.hours.reservationsOpen,
			reservationsClose: pickedDay.hours.reservationsClose,
		};

		const isOpenEqualZero = pickedDay.hours.reservationsOpen === 0;
		const isOpenSmaller =
			pickedDay.hours.reservationsOpen < pickedDay.hours.reservationsClose - 1;

		const isCloseEqual23 = pickedDay.hours.reservationsClose === 23;

		if (operation === "openDecrease" && !isOpenEqualZero)
			updatedHours.reservationsOpen = --pickedDay.hours.reservationsOpen;

		if (operation === "openIncrease" && isOpenSmaller)
			updatedHours.reservationsOpen = ++pickedDay.hours.reservationsOpen;

		if (operation === "closeDecrease" && isOpenSmaller)
			updatedHours.reservationsClose = --pickedDay.hours.reservationsClose;

		if (operation === "closeIncrease" && !isCloseEqual23)
			updatedHours.reservationsClose = ++pickedDay.hours.reservationsClose;

		setOpenDays((prev) => {
			const updatedSchedule = prev.map((dayData) => {
				if (dayData.day === pickedDay.day) {
					dayData.hours = updatedHours;
				}

				return dayData;
			});

			toggleRestaurantState({
				openDays: updatedSchedule,
			});

			return updatedSchedule;
		});
	}

	//Toggle
	function switchToggleHandler(value) {
		setToggleData((prev) => {
			toggleRestaurantState({
				[value]: !restaurantData[value],
			});

			return {
				...prev,
				[value]: !restaurantData[value],
			};
		});
	}

	//Limits
	function reservationLimitHandler(type, data) {
		if (data === "reservationLimit") {
			if (type === "substract" && restaurantData.reservationLimit > 1) {
				updateDataFields({
					reservationLimit: restaurantData.reservationLimit - 1,
				});
			}
			if (type === "add") {
				updateDataFields({
					reservationLimit: restaurantData.reservationLimit + 1,
				});
			}
		}

		if (data === "reservationAdvance") {
			if (
				type === "substract" &&
				restaurantData.reservationAdvance / MS_PER_DAY > 0
			) {
				updateDataFields({
					reservationAdvance: restaurantData.reservationAdvance - MS_PER_DAY,
				});
			}
			if (type === "add") {
				updateDataFields({
					reservationAdvance: restaurantData.reservationAdvance + MS_PER_DAY,
				});
			}
		}

		if (data === "cancellationAdvance") {
			if (
				type === "substract" &&
				restaurantData.cancellationAdvance / MS_PER_DAY > 0
			) {
				updateDataFields({
					cancellationAdvance: restaurantData.cancellationAdvance - MS_PER_DAY,
				});
			}
			if (type === "add") {
				updateDataFields({
					cancellationAdvance: restaurantData.cancellationAdvance + MS_PER_DAY,
				});
			}
		}
	}

	//Input
	function onInputSubmit(data) {
		if (submitResult.isHold) return;

		updateDataFields({
			description: data.description,
			phone: data.phone,
			url: data.url,
		});

		setSubmitResult({
			message: "Submitted!",
			isHold: true,
		});

		setTimeout(() => {
			setSubmitResult({
				message: null,
				isHold: false,
			});
		}, 3000);
	}

	return (
		<div className="manage-restaurant-container">
			<div>
				<InnerBox title="Week Schedule">
					<WeekSchedule>
						{openDays.map((day, i) => {
							return (
								<WeekDay
									key={i}
									name={day.dayLong}
									isOpen={day.isOpen}
									handleToggle={() => switchDayOpenHandler(day)}
									open={day.hours.reservationsOpen}
									close={day.hours.reservationsClose}
									onOpenDecrease={reservationsHourHandler.bind(
										this,
										day,
										"openDecrease"
									)}
									onOpenIncrease={reservationsHourHandler.bind(
										this,
										day,
										"openIncrease"
									)}
									onCloseDecrease={reservationsHourHandler.bind(
										this,
										day,
										"closeDecrease"
									)}
									onCloseIncrease={reservationsHourHandler.bind(
										this,
										day,
										"closeIncrease"
									)}
								/>
							);
						})}
					</WeekSchedule>
				</InnerBox>
				<InnerBox title="Toggle">
					{Object.keys(toggleData).map((item, i) => {
						return (
							<InnerBoxToggleItem
								toggle
								key={i}
								name={camelToTitle(item)}
								status=""
								handleToggle={() => switchToggleHandler(item)}
								isOn={toggleData[item]}
							/>
						);
					})}
				</InnerBox>
				<InnerBox title="Limits" wrap>
					<InnerBoxReservationLimitItem
						value={limitsData.reservationLimit}
						onSubstract={reservationLimitHandler.bind(
							this,
							"substract",
							"reservationLimit"
						)}
						onAdd={reservationLimitHandler.bind(
							this,
							"add",
							"reservationLimit"
						)}
					/>
					<InnerBoxReservationAdvanceItem
						value={
							typeof limitsData.reservationAdvance === "number"
								? limitsData.reservationAdvance / MS_PER_DAY
								: limitsData.reservationAdvance
						}
						onSubstract={reservationLimitHandler.bind(
							this,
							"substract",
							"reservationAdvance"
						)}
						onAdd={reservationLimitHandler.bind(
							this,
							"add",
							"reservationAdvance"
						)}
					/>
					<InnerBoxCancellationAdvanceItem
						value={
							typeof limitsData.cancellationAdvance === "number"
								? limitsData.cancellationAdvance / MS_PER_DAY
								: limitsData.cancellationAdvance
						}
						onSubstract={reservationLimitHandler.bind(
							this,
							"substract",
							"cancellationAdvance"
						)}
						onAdd={reservationLimitHandler.bind(
							this,
							"add",
							"cancellationAdvance"
						)}
					/>
				</InnerBox>
				<InnerBox title="Tags">
					<TagsInnerContainer
						availableTags={tagsData.availableTags}
						pickedTags={tagsData.pickedTags}
					/>
				</InnerBox>
				<InnerBox title="Input">
					<DescriptionItem
						title="Profile Description"
						inputStyle="description-input"
						inputType="text"
						onChange={(value) =>
							setInputData((prev) => ({
								...prev,
								description: value,
							}))
						}
						value={inputData.description}
					/>
					<DescriptionItem
						title="Phone Number"
						inputStyle="phone-input"
						inputType="number"
						letterSpacing={1}
						onChange={(value) => {
							setInputData((prev) => ({
								...prev,
								phone: value,
							}));
						}}
						value={inputData.phone}
					/>
					<DescriptionItem
						title="URL"
						inputStyle="url-input"
						inputType="text"
						onChange={(value) => {
							setInputData((prev) => ({
								...prev,
								url: value,
							}));
						}}
						value={inputData.url}
					/>
					<button
						className="manage-restaurant--input-container--button"
						onClick={onInputSubmit.bind(this, inputData)}
						data-input-submit-result={submitResult.message}
					>
						Submit
					</button>
				</InnerBox>
			</div>
		</div>
	);
}

export default ManageRestaurant;
