import "./WeekSchedule.css";

function WeekSchedule({ children, onSubmit }) {
	return (
		<>
			<div className="week-schedule--container">{children}</div>
			{onSubmit && (
				<div className="week-schedule--submit-button-container">
					<button onClick={onSubmit}>SUBMIT CHANGES</button>
				</div>
			)}
		</>
	);
}

export default WeekSchedule;
