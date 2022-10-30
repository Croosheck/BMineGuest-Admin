import "./ReservationListItem.css";
import React from "react";

function ReservationListItem({
	clientsName,
	clientsEmail,
	extrasTotalPrice,
	reservationDate,
	table,
	onDelete,
	confirmed,
	cancelled,
	onConfirm,
	onCancel,
}) {
	const people = table.tSeats === 1 ? "guest" : "guests";

	function openReservationHandler() {}

	function getReservationStatusHandler() {
		if (!confirmed && !cancelled)
			return <div className="reservartion-status --pending">Pending</div>;
		if (confirmed)
			return <div className="reservartion-status --confirmed">Confirmed</div>;
		if (cancelled)
			return <div className="reservartion-status --cancelled">Cancelled</div>;
	}

	const reservationStatus = getReservationStatusHandler();

	return (
		<div className={"reservation-container"} onClick={openReservationHandler}>
			<div className="reservation-inner-container">
				<div className="reservation-details">
					<div className="reservation-detail --name">
						Reservation for:&nbsp;<div className="name">{clientsName}</div>
					</div>
					<div className="reservation-detail --email">
						Guest's Email:&nbsp;
						<a href={`mailto:${clientsEmail}`} className="email">
							{clientsEmail}
						</a>
					</div>
					<div className="reservation-detail --date">
						Reservation Date:&nbsp;<div className="date">{reservationDate}</div>
					</div>
					<div className="reservation-detail --table">
						For&nbsp;<div className="table">{table.tSeats}</div>&nbsp;{people}
					</div>
					<div className="reservation-detail --xPrice">
						Extras Total Price:&nbsp;
						<div className="xPrice">{extrasTotalPrice}$</div>
					</div>
				</div>
				<div className="reservation-status-container">{reservationStatus}</div>
				<div className="reservation-options">
					<div className="dropdown">
						<button className="dropbtn">Options</button>
						<div className="dropdown-content">
							<div className="dropdown-content-btns-inner-container">
								<button
									className="dropdown-content-btn dropdown-btn-left"
									onClick={onConfirm}
								>
									Confirm
								</button>
								<button
									className="dropdown-content-btn dropdown-btn-right"
									onClick={onCancel}
								>
									Cancel
								</button>
							</div>
							<button className="reservation-delete-btn" onClick={onDelete}>
								Delete
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ReservationListItem;
