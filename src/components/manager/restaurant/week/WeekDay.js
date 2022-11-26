import "./WeekDay.css";
import Switch from "../../../UI/Switch";

function WeekDay({
	name,
	open,
	close,
	num,
	onOpenConfirm,
	onCloseConfirm,
	isOpen,
	handleToggle,
	isOn,
	onOpenDecrease,
	onOpenIncrease,
	onCloseDecrease,
	onCloseIncrease,
}) {
	const status = isOpen ? (
		<div data-reservations-status="Reservations open between hours below.">
			<div></div>
		</div>
	) : (
		<div data-reservations-status="Reservations closed for that day.">
			<div></div>
		</div>
	);

	return (
		<div className="week-day--container">
			<h4>{name.charAt(0).toUpperCase() + name.slice(1)}</h4>
			<div className="week-day--open-status-container">
				{status}
				<div className="week-day--switch-box">
					<Switch isOn={isOpen} handleToggle={handleToggle} onColor="#4CB731" />
				</div>
			</div>
			<div className="week-day--hours--main-container">
				<div className="week-day--hour-container hour-container--open">
					<div className="week-day--hour-number hour-number-open">
						Open: {open ? open : "N/A"}
					</div>
					<div className="week-day--hour-buttons-container">
						<button onClick={onOpenDecrease}>—</button>
						<button onClick={onOpenIncrease}>+</button>
					</div>
				</div>
				<div className="week-day--hour-container hour-container--close">
					<div className="week-day--hour-number hour-number-close">
						Closed: {close ? close : "N/A"}
					</div>
					<div className="week-day--hour-buttons-container">
						<button onClick={onCloseDecrease}>—</button>
						<button onClick={onCloseIncrease}>+</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default WeekDay;
