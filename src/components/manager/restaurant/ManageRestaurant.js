import "./ManageRestaurant.css";
import React, { useEffect, useState } from "react";
import { toggleRestaurantState } from "../../../util/toggleRestaurantState";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import InnerBox from "./InnerBox";
import InnerBoxListItem from "./InnerBoxListItem";
import { camelToTitle } from "../../../util/camelToTitle";

function ManageRestaurant() {
	const [restaurantData, setRestaurantData] = useState();
	const [toggleData, setToggleData] = useState({
		reservationsEnabled: false,
		tablesFiltering: false,
	});

	useEffect(() => {
		async function getCurrentData() {
			const docRef = doc(db, "restaurants", auth.currentUser.uid);
			const unsub = onSnapshot(docRef, (doc) => {
				setRestaurantData(doc.data());

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

	return (
		<div className="manage-restaurant-container">
			<div>
				<InnerBox title="Toggle">
					{Object.keys(toggleData).map((item, i) => {
						return (
							<InnerBoxListItem
								key={i}
								toggle
								name={camelToTitle(item)}
								handleToggle={() => switchToggleHandler(item)}
								initialState={toggleData[item]}
								switchValue={toggleData[item]}
								status=""
							/>
						);
					})}
				</InnerBox>
				<InnerBox></InnerBox>
				<InnerBox></InnerBox>
			</div>
		</div>
	);
}

export default ManageRestaurant;
