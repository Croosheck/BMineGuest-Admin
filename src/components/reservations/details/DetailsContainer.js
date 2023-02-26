import "./DetailsContainer.css";

function DetailsContainer({ extras, extrasImgs, table }) {
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
					<div>{table.tSeats}</div>
					<div>{table.tPlacement}</div>
					<div>{table.tId}</div>
				</div>
				<div className="details-label">TABLE</div>
			</div>
		</div>
	);
}

export default DetailsContainer;
