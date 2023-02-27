import "./ReservationListItem.css";
import { FcCheckmark, FcCancel, FcPhone } from "react-icons/fc";
import { FaTrashAlt, FaTimes, FaPhoneAlt } from "react-icons/fa";
import { BsCheckLg, BsHourglassSplit } from "react-icons/bs";
import DetailsContainer from "./details/DetailsContainer";
import { formatDate } from "../../util/formatDate";

function ReservationListItem({
	clientsName,
	clientsEmail,
	extrasTotalPrice,
	reservationDate,
	reservationDateTimestamp,
	table,
	tableImgUrl,
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
	howMany,
	requestData = Object(),
}) {
	const people = table.tSeats === 1 ? "guest" : "guests";

	function getReservationStatusHandler() {
		if (!confirmed && !cancelled && !callRequest)
			return (
				<div className="reservartion-status --pending">
					<BsHourglassSplit />
				</div>
			);
		if (confirmed)
			return (
				<div className="reservartion-status --confirmed">
					<BsCheckLg />
				</div>
			);
		if (cancelled)
			return (
				<div className="reservartion-status --cancelled">
					<FaTimes />
				</div>
			);
		if (!confirmed && !cancelled && callRequest)
			return (
				<div className="reservartion-status --callRequest">
					<FaPhoneAlt />
				</div>
			);
	}

	const reservationStatus = getReservationStatusHandler();

	return (
		<div className="reservation-container">
			<div
				className={`reservation-inner-container ${
					reservationPicked && "--reservation-infos"
				}`}
			>
				<div className="reservation--top-inner-container">
					{/* ///////////////SECTION INFO/////////////// */}
					<div className="reservation-infos">
						<div className="reservation-info --name">
							👤&nbsp;<div className="name">{clientsName}</div>
						</div>
						<div className="reservation-info --email">
							📧&nbsp;
							<a href={`mailto:${clientsEmail}`} className="email">
								{clientsEmail}
							</a>
						</div>

						<div className="reservation-info --date">
							📆&nbsp;<div className="date">{reservationDate}</div>
							{/* 📆&nbsp;
							<div className="date">{formatDate(reservationDateTimestamp)}</div> */}
						</div>
						<div className="reservation-info --guests">
							👥&nbsp;<div className="guests">{howMany}</div>&nbsp;{people}
						</div>
						<div className="reservation-info --xPrice">
							💰&nbsp;
							<div className="xPrice">{extrasTotalPrice}$</div>
						</div>
						{requestData.requestType && (
							<>
								<div className="reservation-info --userRequest">
									User Request:&nbsp;
									<div className="userRequest">{requestData.requestType}</div>
								</div>
								<div className="reservation-info --requestMessage">
									Request Message:&nbsp;
									<div className="requestMessage">
										{requestData.requestMessage}
									</div>
								</div>
							</>
						)}
					</div>
					{/* ///////////////SECTION STATUS/////////////// */}
					<div className="reservation-status-container">
						{reservationStatus}
					</div>
					{/* ///////////////SECTION OPTIONS/////////////// */}
					<div className="reservation-options">
						<div className="dropdown">
							<button className="dropbtn">Options</button>
							<div className="dropdown-content">
								<div className="dropdown-content-btns-inner-container">
									<button
										className="dropdown-content-btn dropdown-btn-left"
										onClick={onConfirm}
									>
										<FcCheckmark />
									</button>
									<button
										className="dropdown-content-btn dropdown-btn-right"
										onClick={onCancel}
									>
										<FcCancel />
									</button>
								</div>
								<button
									className="reservation-callus-btn"
									onClick={onCallRequest}
								>
									<FcPhone />
								</button>
								<button className="reservation-delete-btn" onClick={onDelete}>
									<FaTrashAlt />
								</button>
							</div>
						</div>
					</div>
				</div>
				{reservationPicked && (
					<DetailsContainer
						extras={extras}
						extrasImgs={extrasImgs}
						table={table}
						tableImgUrl={tableImgUrl}
					/>
				)}
				<button className="reservation-item--details-button" onClick={onClick}>
					Details
				</button>
			</div>
		</div>
	);
}

export default ReservationListItem;
