import ManageLimitButton from "../../../../UI/ManageLimitButton";
import "./InnerBoxReservationAdvanceItem.css";

function InnerBoxReservationAdvanceItem({ value, onSubstract, onAdd }) {
	let reservationAdvance = value;
	if (typeof value === "number") {
		reservationAdvance = value === 1 ? `${value} day` : `${value} days`;
	}
	const textStyle =
		value === 0 ? { fontSize: "150%", color: "#2B6198" } : { fontSize: "150%" };

	return (
		<fieldset className="manage-restaurant--limit-advance--item reservation-advance--container">
			<legend>Reservation Advance</legend>
			<div className="advance-item--content-container">
				<div style={textStyle} className="advance-item--number-container">
					{reservationAdvance}
				</div>
				<div className="advance-item--buttons-container">
					<ManageLimitButton onClick={onSubstract}>—</ManageLimitButton>
					<ManageLimitButton onClick={onAdd}>+</ManageLimitButton>
				</div>
			</div>
		</fieldset>
	);
}

export default InnerBoxReservationAdvanceItem;
