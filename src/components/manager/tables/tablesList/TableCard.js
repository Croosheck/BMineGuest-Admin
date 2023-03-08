import { useEffect, useState } from "react";
import "./TableCard.css";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BiHide } from "react-icons/bi";
import { deleteTableImage } from "../../../../util/storage";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function TableCard({
	restaurantTables = [],
	tablesImgs = {},
	deleteCallback = () => {},
}) {
	const [imgLoaded, setImgLoaded] = useState(false);

	useEffect(() => {}, [imgLoaded]);

	const placeholder = require("../../../../assets/imgs/imagePlaceholders/default.jpg");

	function onTableDeleteHandler(filename, data) {
		deleteTableImage({
			filename: filename,
			successCallback: deleteCallback,
			data: data,
		});
	}

	function onTableHideHandler() {}

	return (
		<div className="manageTables--tables-container">
			<TransitionGroup
				component="div"
				className="tables-container--list-container"
			>
				{restaurantTables.map((table, i) => {
					return (
						<CSSTransition key={table.tId} timeout={800} classNames="tag">
							<div key={i} className="list-container--table-card">
								<button className="table-card--edit-button">
									<AiFillEdit size={20} />
								</button>
								<div className="table-card--image-container">
									{!imgLoaded && (
										<img
											id="table-card--image"
											src={placeholder}
											alt="Table placeholder"
										/>
									)}
									<img
										id="table-card--image"
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
											onTableDeleteHandler(filename, table);
										}}
									>
										<AiFillDelete size={28} />
									</button>
									<button
										className="card-options--toggle"
										onClick={onTableHideHandler}
									>
										<BiHide size={28} />
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

export default TableCard;
