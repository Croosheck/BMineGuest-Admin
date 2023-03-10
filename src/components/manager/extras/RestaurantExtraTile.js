import "./AvailableExtraTile.css";
import "./RestaurantExtraTile.css";
import placeholder from "../../../assets/imgs/imagePlaceholders/default.jpg";

function RestaurantExtraTile({
	label,
	url,
	onClick,
	onDelete,
	xPrice,
	index,
	itemsTotal,
}) {
	const extraImage = url ? (
		<img src={url} alt="Extra Item" />
	) : (
		// <div className="extras-nofile">Image loading...</div>
		<img src={placeholder} alt="Extra Item" />
	);

	let risingDuration = `${0.2 * (index + 1)}`;

	return (
		<>
			<div
				style={{
					animationDuration: risingDuration + "s",
					animationDelay: risingDuration * 0.5 + "s",
				}}
				className="restaurant-extras-item"
				onClick={onClick}
				onLoad={() => {
					if (index + 1 === itemsTotal) risingDuration = "0.2s";
				}}
			>
				<div className="extras-item-picture">{extraImage}</div>
				<div className="extras-item-label-container">
					<p className="extras-item-label">{label}</p>
				</div>
				<div className="restaurantExtra-dropdown-content">
					<form className="restaurantExtra-dropdown-inner-content">
						<h6>Price: {xPrice}</h6>
						<div className="restaurantExtra-buttons-container">
							<button onClick={(e) => onDelete(e)}>Delete</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default RestaurantExtraTile;
