import "./WeekDay.css";
import Switch from "../../../UI/Switch";
import redLight from "../../../../assets/icons/red-light.png";
import greenLight from "../../../../assets/icons/green-light.png";

function WeekDay({
	name,
	num,
	open,
	close,
	onOpenConfirm,
	onCloseConfirm,
	isOpen,
	handleToggle,
	isOn,
}) {
	const status = isOpen ? (
		<div data-reservations-status="Reservations open between hours below.">
			<img src={greenLight} alt="open icon" />
		</div>
	) : (
		<div data-reservations-status="Reservations closed for that day.">
			<img src={redLight} alt="closed icon" />
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
		</div>
	);
}

export default WeekDay;
