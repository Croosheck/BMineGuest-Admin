import "./ManageRestaurant.css";
import { useEffect, useState } from "react";
import { toggleRestaurantState } from "../../../util/toggleRestaurantState";
import {
	collection,
	doc,
	getDocs,
	onSnapshot,
	query,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import InnerBox from "./InnerBox";
import InnerBoxToggleItem from "./toggle/toggleItem/InnerBoxToggleItem";
import { camelToTitle } from "../../../util/camelToTitle";
import InnerBoxReservationLimitItem from "./limits/reservationLimitItem/InnerBoxReservationLimitItem";
import InnerBoxReservationAdvanceItem from "./limits/advanceItem/InnerBoxReservationAdvanceItem";
import { manipulateNumbersData } from "../../../util/manipulateNumbersData";
import TagsInnerContainer from "./tags/TagsInnerContainer";
import WeekSchedule from "./week/WeekSchedule";
import WeekDay from "./week/WeekDay";
import { weekScheduleDay } from "../../../util/weekSchedule";

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
	});
	const [tagsData, setTagsData] = useState({
		availableTags: [],
		pickedTags: [],
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
				}));

				//real-time PICKED tags
				setTagsData((prev) => ({
					availableTags: [...prev.availableTags],
					pickedTags: [...doc.data().restaurantTags],
				}));
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

		if (operation === "openDecrease")
			updatedHours.reservationsOpen = --pickedDay.hours.reservationsOpen;
		if (operation === "openIncrease")
			updatedHours.reservationsOpen = ++pickedDay.hours.reservationsOpen;
		if (operation === "closeDecrease")
			updatedHours.reservationsClose = --pickedDay.hours.reservationsClose;
		if (operation === "closeIncrease")
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
				manipulateNumbersData({
					reservationLimit: restaurantData.reservationLimit - 1,
				});
			}
			if (type === "add") {
				manipulateNumbersData({
					reservationLimit: restaurantData.reservationLimit + 1,
				});
			}
		}

		if (data === "advanceLimit") {
			if (
				type === "substract" &&
				restaurantData.reservationAdvance / MS_PER_DAY > 0
			) {
				manipulateNumbersData({
					reservationAdvance: restaurantData.reservationAdvance - MS_PER_DAY,
				});
			}
			if (type === "add") {
				manipulateNumbersData({
					reservationAdvance: restaurantData.reservationAdvance + MS_PER_DAY,
				});
			}
		}
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
							"advanceLimit"
						)}
						onAdd={reservationLimitHandler.bind(this, "add", "advanceLimit")}
					/>
				</InnerBox>
				<InnerBox title="Tags">
					<TagsInnerContainer
						availableTags={tagsData.availableTags}
						pickedTags={tagsData.pickedTags}
					/>
				</InnerBox>
			</div>
		</div>
	);
}

export default ManageRestaurant;
