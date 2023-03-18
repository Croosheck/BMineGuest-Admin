import { useState } from "react";
import "./TableCards.css";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BiHide, BiShow } from "react-icons/bi";
import { deleteTableImage, updateTable } from "../../../../util/storage";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import WarningModal from "../../../UI/warningModal/WarningModal";

function TableCards({
	restaurantTables = [],
	tablesImgs = {},
	deleteCallback = () => {},
}) {
	const [imgLoaded, setImgLoaded] = useState(false);
	const [warningModal, setWarningModal] = useState({
		isOpen: false,
		confirmCallback: () => {},
	});

	const placeholder = require("../../../../assets/imgs/imagePlaceholders/default.jpg");

	function onTableDeleteHandler(filename, data) {
		deleteTableImage({
			filename: filename,
			successCallback: deleteCallback,
			data: data,
		});
	}

	function onTableHideHandler(table) {
		updateTable({
			arrayOldData: restaurantTables,
			itemId: table.tId,
			updatedItem: {
				...table,
				tAvailability: !table.tAvailability,
			},
		});
	}

	return (
		<div className="manageTables--tables-container">
			{warningModal.isOpen && (
				<WarningModal
					message={`Are You sure?\nThe table will be permanently removed.`}
					buttonAbort={{
						title: "Cancel",
						onClick: () => {
							setWarningModal({
								isOpen: false,
								confirmCallback: () => {},
							});
						},
					}}
					buttonConfirm={{
						title: "Delete",
						onClick: () => {
							warningModal.confirmCallback();
							setWarningModal({
								isOpen: false,
								confirmCallback: () => {},
							});
						},
					}}
				/>
			)}
			<TransitionGroup
				component="div"
				className="tables-container--list-container"
			>
				{restaurantTables.map((table, i) => {
					const isAvailable = table.tAvailability;
					const toggleShow = isAvailable ? (
						<BiShow size={28} />
					) : (
						<BiHide size={28} />
					);
					const inactive = !isAvailable ? "--inactive" : "";

					return (
						<CSSTransition key={table.tId} timeout={800} classNames="tag">
							<div key={i} className="list-container--table-card">
								<button className="table-card--edit-button">
									<AiFillEdit size={20} />
								</button>
								<div className="table-card--image-container">
									{!imgLoaded && (
										<img
											className="table-card--image table--image-placeholder"
											src={placeholder}
											alt="Table placeholder"
										/>
									)}
									<img
										className={`table-card--image ${inactive}`}
										src={tablesImgs[table.tId]?.imgUrl}
										alt="Table card"
										onLoad={() => setImgLoaded(true)}
									/>
								</div>
								<h4 id="table-card--placement">{table.tPlacement}</h4>
								<h4 id="table-card--seats">Seats: {table.tSeats}</h4>
								<div className="table-card--options-container">
									<button
										className="card-options--delete"
										onClick={() => {
											const filename = tablesImgs[table.tId]?.filename;
											setWarningModal({
												isOpen: true,
												confirmCallback: () =>
													onTableDeleteHandler(filename, table),
											});
										}}
									>
										<AiFillDelete size={28} />
									</button>
									<button
										className="card-options--toggle"
										onClick={() => onTableHideHandler(table)}
									>
										{toggleShow}
									</button>
								</div>
							</div>
						</CSSTransition>
					);
				})}
			</TransitionGroup>
		</div>
	);
}

export default TableCards;
