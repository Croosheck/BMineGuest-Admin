import "./InnerBoxReservationLimitItem.css";
import React from "react";
import ManageLimitButton from "../../../UI/ManageLimitButton";

function InnerBoxReservationLimitItem({ value, onSubstract, onAdd }) {
	let reservationSize = value;

	if (typeof value === "number") {
		reservationSize = value === 1 ? `${value} guest` : `${value} people`;
	}

	return (
		<fieldset className="manage-restaurant--limit-advance--item reservation-limit--container">
			<legend>Reservation Max Size</legend>
			<div className="limit-item--content-container">
				<div className="limit-item--number-container">{reservationSize}</div>
				<div className="limit-item--buttons-container">
					<ManageLimitButton onClick={onSubstract}>Decrease</ManageLimitButton>
					<ManageLimitButton onClick={onAdd}>Increase</ManageLimitButton>
				</div>
			</div>
		</fieldset>
	);
}

export default InnerBoxReservationLimitItem;
