import "./AvailableExtraTile.css";
import "./RestaurantExtraTile.css";

function RestaurantExtraTile({ label, url, onClick, onDelete, xPrice }) {
	const extraImage = url ? (
		<img src={url} alt="Extra Item" />
	) : (
		<div className="extras-nofile">Image loading...</div>
	);

	return (
		<>
			<div className="restaurant-extras-item" onClick={onClick}>
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
