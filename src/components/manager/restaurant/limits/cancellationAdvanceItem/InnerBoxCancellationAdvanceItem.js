import ManageLimitButton from "../../../../UI/ManageLimitButton";
import "./InnerBoxCancellationAdvanceItem.css";

function InnerBoxCancellationAdvanceItem({ value, onSubstract, onAdd }) {
	let cancellationAdvance = value;
	if (typeof value === "number") {
		cancellationAdvance =
			value === 1
				? `${value} day`
				: `${value} days` && value === 0
				? `${value} (Not recommended)`
				: `${value} days`;
	}

	const textStyle =
		value === 0
			? {
					fontSize: "120%",
					color: "#2B6198",
					textAlign: "center",
					justifyContent: "center",
					alignItems: "center",
			  }
			: { fontSize: "150%" };

	return (
		<fieldset className="manage-restaurant--limit-advance--item reservation-advance--container">
			<legend>Cancellation Advance</legend>
			<div className="advance-item--content-container">
				<div style={textStyle} className="advance-item--number-container">
					{cancellationAdvance}
				</div>
				<div className="advance-item--buttons-container cancellation-buttons-container">
					<ManageLimitButton onClick={onSubstract}>—</ManageLimitButton>
					<ManageLimitButton onClick={onAdd}>+</ManageLimitButton>
				</div>
			</div>
		</fieldset>
	);
}

export default InnerBoxCancellationAdvanceItem;
