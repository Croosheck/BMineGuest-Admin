import "./ReservationListItem.css";
import React from "react";

function ReservationListItem({
	clientsName,
	clientsEmail,
	extrasTotalPrice,
	reservationDate,
	table,
	extras,
	extrasImgs,
	onDelete,
	confirmed,
	cancelled,
	callRequest,
	onConfirm,
	onCancel,
	onCallRequest,
	onClick,
	reservationPicked,
}) {
	const people = table.tSeats === 1 ? "guest" : "guests";

	function openReservationHandler() {}

	function getReservationStatusHandler() {
		if (!confirmed && !cancelled && !callRequest)
			return <div className="reservartion-status --pending">Pending</div>;
		if (confirmed)
			return <div className="reservartion-status --confirmed">Confirmed</div>;
		if (cancelled)
			return <div className="reservartion-status --cancelled">Cancelled</div>;
		if (!confirmed && !cancelled && callRequest)
			return (
				<div className="reservartion-status --callRequest">Call Request</div>
			);
	}

	const reservationStatus = getReservationStatusHandler();

	return (
		<div className="reservation-container" onClick={openReservationHandler}>
			<div
				className={`reservation-inner-container ${
					reservationPicked && "--reservation-details"
				}`}
			>
				<div className="reservation--top-inner-container">
					<div className="reservation-details">
						<div className="reservation-detail --name">
							👤&nbsp;<div className="name">{clientsName}</div>
						</div>
						<div className="reservation-detail --email">
							📧&nbsp;
							<a href={`mailto:${clientsEmail}`} className="email">
								{clientsEmail}
							</a>
						</div>

						<div className="reservation-detail --date">
							📆&nbsp;<div className="date">{reservationDate}</div>
						</div>
						<div className="reservation-detail --table">
							👥&nbsp;<div className="table">{table.tSeats}</div>&nbsp;{people}
						</div>
						<div className="reservation-detail --xPrice">
							💰&nbsp;
							<div className="xPrice">{extrasTotalPrice}$</div>
						</div>
					</div>
					{/* ///////////////SECTION/////////////// */}
					<div className="reservation-status-container">
						{reservationStatus}
					</div>
					{/* ///////////////SECTION/////////////// */}
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
								<button
									className="reservation-callus-btn"
									onClick={onCallRequest}
								>
									Call Request
								</button>
								<button className="reservation-delete-btn" onClick={onDelete}>
									Delete
								</button>
							</div>
						</div>
					</div>
				</div>
				{reservationPicked && (
					<div className="reservation--details-container">
						<div className="details--inner-container">
							<div className="details--list-container">
								{extras.map((xItem, i) => {
									return (
										<div
											key={i}
											className="details--inner-container--extraItem"
										>
											<div className="details--extra-name">{xItem.xName}</div>
											<img
												src={extrasImgs[xItem.xFileName.slice(0, -4)]}
												alt="Extra Item"
											/>
											<div className="details--extra-price">
												{xItem.xPrice}$
											</div>
										</div>
									);
								})}
							</div>
						</div>
						<div className=" details--inner-container">
							<div className="details--list-container"></div>
						</div>
					</div>
				)}
				<button className="reservation-item--details-button" onClick={onClick}>
					Details
				</button>
			</div>
		</div>
	);
}

export default ReservationListItem;
