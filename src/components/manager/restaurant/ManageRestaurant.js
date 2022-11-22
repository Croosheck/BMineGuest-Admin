import "./ManageRestaurant.css";
import { useEffect, useState } from "react";
import { toggleRestaurantState } from "../../../util/toggleRestaurantState";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import InnerBox from "./InnerBox";
import InnerBoxToggleItem from "./toggleItem/InnerBoxToggleItem";
import { camelToTitle } from "../../../util/camelToTitle";
import InnerBoxReservationLimitItem from "./reservationLimitItem/InnerBoxReservationLimitItem";
import InnerBoxReservationAdvanceItem from "./advanceItem/InnerBoxReservationAdvanceItem";
import { manipulateNumbersData } from "../../../util/manipulateNumbersData";

const MS_PER_DAY = 86400000;

function ManageRestaurant() {
	const [restaurantData, setRestaurantData] = useState();
	const [toggleData, setToggleData] = useState({
		reservationsEnabled: false,
		tablesFiltering: false,
	});
	const [limitsData, setLimitsData] = useState({
		reservationLimit: "Loading...",
		reservationAdvance: "Loading...",
	});

	useEffect(() => {
		async function getCurrentData() {
			const docRef = doc(db, "restaurants", auth.currentUser.uid);
			const unsub = onSnapshot(docRef, (doc) => {
				//Sets real-time restaurant's data
				setRestaurantData(doc.data());

				setLimitsData((prev) => ({
					reservationLimit: doc.data().reservationLimit,
					reservationAdvance: doc.data().reservationAdvance,
				}));

				for (const item in doc.data()) {
					if (typeof doc.data()[item] === "boolean") {
						setToggleData((prev) => {
							return { ...prev, [item]: doc.data()[item] };
						});
					}
				}
			});
		}

		getCurrentData();
	}, []);

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
				<InnerBox title="Toggle">
					{Object.keys(toggleData).map((item, i) => {
						return (
							<InnerBoxToggleItem
								key={i}
								toggle
								name={camelToTitle(item)}
								status=""
								handleToggle={() => switchToggleHandler(item)}
								isOn={toggleData[item]}
							/>
						);
					})}
				</InnerBox>
				<InnerBox wrap>
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
			</div>
		</div>
	);
}

export default ManageRestaurant;
