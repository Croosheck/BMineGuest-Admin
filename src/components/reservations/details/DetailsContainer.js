import "./DetailsContainer.css";

function DetailsContainer({ extras, extrasImgs, table, tableImgUrl }) {
	return (
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
				<div className="details--table-list-container">
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
	);
}

export default DetailsContainer;
