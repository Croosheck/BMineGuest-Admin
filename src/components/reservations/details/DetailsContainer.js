import { useState } from "react";
import "./DetailsContainer.css";
import TableImageModal from "./TableImageModal";

function DetailsContainer({ extras, extrasImgs, table, tableImgUrl }) {
	const [tableModalVisible, setTableModalVisible] = useState(false);

	function onTableImgClickHandler() {
		// if (window.innerWidth <= 580) {
		setTableModalVisible(true);
		// }
	}

	return (
		<>
			{tableModalVisible && (
				<TableImageModal
					tableModalVisible={tableModalVisible}
					onModalClose={() => setTableModalVisible(false)}
					tableImgUrl={tableImgUrl}
					tId={table.tId}
					tPlacement={table.tPlacement}
					tSeats={table.tSeats}
				/>
			)}
			<div className="reservation--details-container">
				<div className="details--inner-container">
					<div className="details--extras-list-container">
						{extras.map((xItem, i) => {
							return (
								<div key={i} className="details--inner-container--extraItem">
									<div className="details--extra-name">{xItem.xName}</div>
									<img
										src={extrasImgs[xItem.xFileName.slice(0, -4)]}
										alt="Extra Item"
									/>
									<div className="details--extra-price">{xItem.xPrice}$</div>
								</div>
							);
						})}
					</div>
					<div className="details-label">EXTRAS</div>
				</div>
				<div className=" details--inner-container">
					<div
						className="details--table-list-container"
						onClick={onTableImgClickHandler}
					>
						<div className="details--table-list-data">
							<div className="details-table--seats--placement">
								<div id="tSeats">Seats: {table.tSeats}</div>
								<div id="tPlacement">{table.tPlacement}</div>
							</div>
							<div id="tId">ID: {table.tId}</div>
						</div>
						<img src={tableImgUrl} alt="Table"></img>
					</div>
					<div className="details-label">TABLE</div>
				</div>
			</div>
		</>
	);
}

export default DetailsContainer;
